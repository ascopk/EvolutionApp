import { CmsContext, CmsEntry, CmsEntryValues } from "@webiny/api-headless-cms/types";

enum ModelName {
    // key: Type, value: modelId
    Person = 'person',
    Person_Page = "personspage",
    News = "newsRelease",
    None = "none"
}

/*
 Webiny does not automatically resolve references during lifecycles, meaning we must identify a reference
 and resolve them during the trigger.
*/
export const resolveReference = async (context: CmsContext, entry: CmsEntry<CmsEntryValues>, modelId: string) => {
    const modelIdLowerCase = modelId.toLowerCase();
    const Model: ModelName = modelIdLowerCase as ModelName || ModelName.None

    if (entry.values["headerLogo"]) {
        const manager = await context.cms.getEntryManager("logo");
        const [item] = await manager.getPublishedByIds([entry.values["headerLogo"]["entryId"]]);
        console.log(JSON.stringify(item));
        if (item) {
            entry.values["headerLogo"] = flattenEntry(item);
        } else {
            entry.values["headerLogo"] = null
        }
    }

    if (Model === ModelName.Person) {
        const manager = await context.cms.getEntryManager("personsPage");
        const [item] = await manager.getPublishedByIds([entry.values["personsPage"]["entryId"]]);
        if (item) {
            entry.values["personsPage"] = flattenEntry(item)
        } else {
            entry.values["personsPage"] = null
        }
    }

    if (Model === ModelName.Person_Page) {
        const personsIds = entry.values["persons"]
        const manager = await context.cms.getEntryManager("person");
        const personsValues = await manager.getPublishedByIds(personsIds.map((item: { [x: string]: any; }) => item["entryId"]));
        const persons = []
        for (const item of personsValues) {
            if (item) {
                persons.push(flattenEntry(item));
            }
        }
        entry.values["persons"] = persons
    }

    if (Model === ModelName.News) {
        const manager = await context.cms.getEntryManager("aboutAsco");
        const [item] = await manager.getPublishedByIds([entry.values["aboutAscoFooter"]["entryId"]]);
        if (item) {
            entry.values["aboutAscoFooter"] = flattenEntry(item)
        } else {
            entry.values["aboutAscoFooter"] = null
        }
    }
    
    return entry;
}

// Extracts values from entry and flatens it alongside other fields
export const flattenEntry = (entry: CmsEntry) => {
    const { values, ...otherFields } = entry;

    return {
        ...values,
        ...otherFields
    };
};

