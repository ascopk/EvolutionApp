import {Context as BaseContext} from "@webiny/handler/types";

export interface ContentDeleteContext extends BaseContext{
    cms: {
        onEntryAfterDelete: {
            subscribe: (fn: (params: { model: string; entry:any }) => void) => void;
        };
    };
}