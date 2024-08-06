import { ContextPlugin } from "@webiny/api/plugins/ContextPlugin";
import { EventBridgeClient, PutEventsCommand } from "@webiny/aws-sdk/client-eventbridge";
import { ContentUnpublishContext } from "./types";
import { ascoEnvs, awsconfig } from 'awsconfig';

interface Entry {
    values: Record<string, unknown>;
    [key: string]: unknown;
}

export const createContext = () => {
    return new ContextPlugin<ContentUnpublishContext>(async context => {
        const env = process.env.WEBINY_ENV as string;
        console.log("ENV: ",process.env.WEBINY_ENV);
        /**
         * Subscribe to onEntryAfterDelete to invoke lambda function
         */
        context.cms.onEntryAfterUnpublish.subscribe(async ({ model, entry }) => {
            try {
                // Only proceed if environment is 'dev', 'stage', or 'prod'
                if (ascoEnvs.includes(env)) {
                    console.log(JSON.stringify(env))
                    console.log("Model from cms context", model);
                    console.log("Entry from cms context", entry);
                    const eventBusArn = awsconfig[env].eventbus;
                    const flattenedData = flattenEntry(entry); // Custom function to flatten the entry

                    // Construct event
                    const event = {
                        Entries: [
                            {
                                Source: "asco.webiny",
                                DetailType: "webinyStore",
                                Detail: JSON.stringify({
                                    eventType: "SINGLE",
                                    modType: "REMOVE",
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
                    console.log("Environment can only be 'dev', 'stage', or 'prod'; skipping EventBridge call.");
                }
            } catch (e) {
                throw new Error("ContentUnpublishContext::Error sending event to EventBridge: " + e);
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
