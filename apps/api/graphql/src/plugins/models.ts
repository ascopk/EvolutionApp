import { CmsGroupInput, CmsGroupPlugin, CmsModelInput, CmsModelPlugin } from "@webiny/api-headless-cms";
import groups from "./groups.json";
import models from "./models.json"

const Groups: CmsGroupPlugin[] = [];
const Models: CmsModelPlugin[] = [];

groups.forEach((element: CmsGroupInput) => {
    Groups.push(new CmsGroupPlugin(element));
});

models.forEach((element: CmsModelInput) => {
    return Models.push(new CmsModelPlugin(element));
});

export default [
    ...Groups,
    ...Models
];
