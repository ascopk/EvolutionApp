import {Context as BaseContext} from "@webiny/handler/types";

export interface ContentUpdateContext extends BaseContext{
    cms: {
        onEntryAfterUpdate: {
            subscribe: (fn: (params: { model: string; entry:any }) => void) => void;
        };
    };
}