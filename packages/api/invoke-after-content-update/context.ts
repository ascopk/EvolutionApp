import { ContextPlugin } from "@webiny/api/plugins/ContextPlugin";
import { EventBridgeClient, PutEventsCommand } from "@webiny/aws-sdk/client-eventbridge";
import { CmsContext } from "@webiny/api-headless-cms/types";
import { ascoEnvs, awsconfig } from 'awsconfig';
import { resolveReference, flattenEntry } from '../helper/referenceResolver';

export const createContext = () => {
    return new ContextPlugin<CmsContext>(async context => {
        const env = process.env.WEBINY_ENV as string;
        /**
         * Subscribe to onEntryAfterDelete to invoke lambda function
         */
        context.cms.onEntryAfterUpdate.subscribe(async ({ entry }) => {
            try {
                const status = entry.status;
                const modelId = entry.modelId;
                
                if (status.toLowerCase() == "draft") {
                    console.log("Ignoring draft mode entries");
                    return;
                }

                // Only proceed if environment is 'dev', 'stage', or 'prod'
                if (!ascoEnvs.includes(env)) {
                    console.log("Environment can only be 'dev', 'stage', or 'prod'; skipping EventBridge call.");
                    return;
                }

                console.log('Envionment is', env)
                const evtBus = awsconfig[env];
                
                const eventBusArn = evtBus ? evtBus.eventbus : '';
                console.log('Event Bus Arn', eventBusArn);
                
                // Resolve special cases with references.
                entry = await resolveReference(context, entry, modelId);

                console.log('Updating..', entry)
                const flattenedData = flattenEntry(entry);

                // Construct event
                const event = {
                    Entries: [
                        {
                            Source: "asco.webiny",
                            DetailType: "webinyStore",
                            Detail: JSON.stringify({
                                eventType: "SINGLE",
                                modType: "MODIFY",
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
                throw new Error("ContentUpdateContext::Error sending event to EventBridge: " + e);
            }
        });
    });
};
