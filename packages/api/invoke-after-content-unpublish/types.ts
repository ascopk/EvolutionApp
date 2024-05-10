import {Context as BaseContext} from "@webiny/handler/types";

export interface ContentUnpublishContext extends BaseContext{
    cms: {
        onEntryAfterUnpublish: {
            subscribe: (fn: (params: { model: string; entry:any }) => void) => void;
        };
    };
}