import { ContextPlugin } from "@webiny/api/plugins/ContextPlugin";
import { EventBridgeClient, PutEventsCommand } from "@webiny/aws-sdk/client-eventbridge";
import { CmsContext, CmsEntry } from "@webiny/api-headless-cms/types";
import { ascoEnvs, awsconfig } from 'awsconfig';

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

                // Resolve special cases with references.
                // Person will always contain a personsPage
                if (modelId.toLowerCase() == "person") {
                    const manager = await context.cms.getEntryManager("personsPage");
                    const [item] = await manager.getPublishedByIds([entry.values["personsPage"]["entryId"]]);
                    entry.values["personsPage"] = flattenEntry(item)
                }

                if (modelId.toLowerCase() == "personspage") {
                    const personsIds = entry.values["persons"]
                    const manager = await context.cms.getEntryManager("person");
                    const personsValues = await manager.getPublishedByIds(personsIds.map((item: { [x: string]: any; }) => item["entryId"]));
                    const persons = []
                    for (const item of personsValues) {
                        persons.push(flattenEntry(item));
                    }
                    entry.values["persons"] = persons
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
