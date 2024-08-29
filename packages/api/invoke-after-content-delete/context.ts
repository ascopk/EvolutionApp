import { ContextPlugin } from "@webiny/api/plugins/ContextPlugin";
import { EventBridgeClient, PutEventsCommand } from "@webiny/aws-sdk/client-eventbridge";
import { CmsContext, CmsEntry } from "@webiny/api-headless-cms/types";
import { ascoEnvs, awsconfig } from 'awsconfig';

export const createContext = () => {
    return new ContextPlugin<CmsContext>(async context => {
        const env = process.env.WEBINY_ENV as string;

        context.cms.onEntryAfterDelete.subscribe(async ({ entry }) => {
            try {
                const status = entry.status;
                
                if (status.toLowerCase() == "draft") {
                    console.log("Ignoring draft mode entries");
                    return;
                }
                // Only proceed if environment is 'dev', 'stage', or 'prod'
                if (!ascoEnvs.includes(env)) {
                    console.log("Environment can only be 'dev', 'stage', or 'prod'; skipping EventBridge call.");
                    return;
                }
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
                await eventBridgeClient.send(new PutEventsCommand(event));
            } catch (e) {
                throw new Error("ContentAfterDelete::Error sending event to EventBridge: " + e);
            }
        });
    });
};

/**
 * Flatten the entry object
 * Assumes `entry` is an object with `values` containing nested fields.
 */
const flattenEntry = (entry: CmsEntry) => {
    // Extract values and other fields from entry
    const { values, ...otherFields } = entry;

    // Flatten `values` and merge with other fields
    return {
        ...values,
        ...otherFields
    };
};
