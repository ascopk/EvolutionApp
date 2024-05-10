import {Context as BaseContext} from "@webiny/handler/types";

export interface ContentCreateContext extends BaseContext{
    cms: {
        onEntryAfterCreate: {
            subscribe: (fn: (params: { model: string; entry:any }) => void) => void;
        };
    };
}