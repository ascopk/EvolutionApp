import { CmsGroupInput, CmsGroupPlugin, CmsModelInput, CmsModelPlugin } from "@webiny/api-headless-cms";
import fs from "fs";

const GroupsJson = JSON.parse(fs.readFileSync('./groups.json', 'utf8'));
const ModelsJson = JSON.parse(fs.readFileSync('./models.json', 'utf8'));

const Groups: CmsGroupPlugin[] = [];
const Models: CmsModelPlugin[] = [];

GroupsJson.forEach((element: CmsGroupInput) => {
    Groups.push(new CmsGroupPlugin(element));
});

ModelsJson.forEach((element: CmsModelInput) => {
    return Models.push(new CmsModelPlugin(element));
});

export default [
    ...Groups,
    ...Models
];
