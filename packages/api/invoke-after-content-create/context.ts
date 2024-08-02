import { ContextPlugin } from "@webiny/api/plugins/ContextPlugin";
import { EventBridgeClient, PutEventsCommand } from "@webiny/aws-sdk/client-eventbridge";
import { ContentCreateContext } from "./types";

interface Entry {
    values: Record<string, unknown>;
    [key: string]: unknown;
}

/**
 * Define EventBridge Event Bus ARNs based on environment
 */
const eventBusArns: Record<'dev' | 'stage' | 'prod' | 'default', string> = {
    dev: "arn:aws:events:us-east-1:477761241525:event-bus/dev-dp-core-eventBus",
    stage: "arn:aws:events:us-east-1:953078433933:event-bus/stage-dp-core-eventBus",
    prod: "arn:aws:events:us-east-1:121566555105:event-bus/prod-dp-core-eventBus",
    default: ''
};

/**
 * Get the Event Bus ARN based on your environment.
 * This might be dynamically set in your application configuration.
 */
const environment: 'dev' | 'stage' | 'prod' = (process.env.NODE_ENV as 'dev' | 'stage' | 'prod') || 'default';

/**
 * Ensure environment is valid
 */
if (!['dev', 'stage', 'prod'].includes(environment)) {
    throw new Error(`Invalid NODE_ENV value: ${environment}. Must be 'dev', 'stage', or 'prod'.`);
}

const eventBusArn = eventBusArns[environment];

export const createContext = () => {
    return new ContextPlugin<ContentCreateContext>(async context => {
        /**
         * Subscribe to onEntryAfterCreate to send an event to EventBridge
         */
        context.cms.onEntryAfterCreate.subscribe(async ({ model, entry }) => {
            try {
                console.log("Model from cms context", model);
                console.log("Entry from cms context", entry);
                // Only proceed if environment is 'dev', 'stage', or 'prod'
                if (['dev', 'stage', 'prod'].includes(environment)) {
                    const flattenedData = flattenEntry(entry); // Custom function to flatten the entry

                    // Construct event
                    const event = {
                        Entries: [
                            {
                                Source: "asco.webiny",
                                DetailType: "webinyStore",
                                Detail: JSON.stringify({
                                    eventType: "SINGLE",
                                    modType: "INSERT",
                                    data: flattenedData
                                }),
                                EventBusName: eventBusArn
                            }
                        ]
                    };

                    // Create an EventBridge client
                    const eventBridgeClient = new EventBridgeClient({ region: process.env.AWS_REGION });

                    // Send the event to EventBridge
                    const response = await eventBridgeClient.send(new PutEventsCommand(event));

                    console.log("Event sent to EventBridge", response);
                    return response;
                } else {
                    console.log("Environment is 'dev', 'stage', or 'prod'; skipping EventBridge call.");
                }
            } catch (e) {
                throw new Error("ContentAfterCreate::Error sending event to EventBridge: " + e);
            }
        });
    });
};

/**
 * Flatten the entry object
 * Assumes `entry` is an object with `values` containing nested fields.
 */
const flattenEntry = (entry: Entry) => {
    // Extract values and other fields from entry
    const { values, ...otherFields } = entry;

    // Flatten `values` and merge with other fields
    return {
        ...values,
        ...otherFields
    };
};
