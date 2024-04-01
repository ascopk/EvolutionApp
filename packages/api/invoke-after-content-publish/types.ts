import {Context as BaseContext} from "@webiny/handler/types";

export interface ContentPublishContext extends BaseContext{
    cms: {
        onEntryAfterPublish: {
            subscribe: (fn: (params: { model: string; entry:any }) => void) => void;
        };
    };
}