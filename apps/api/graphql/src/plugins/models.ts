import { CmsGroupPlugin, CmsModelPlugin } from "@webiny/api-headless-cms";

export default [
  /*
    Groups
  */

  // ASCO Hub
  new CmsGroupPlugin({
    id: "ascoHub",
    name: "ASCO Hub",
    description: "All content models related to ASCO.org.",
    slug: "ascoHub",
    icon: "fas/home-lg"
  }),

  /*
    Models
  */

  // Basic Page
  new CmsModelPlugin({
    "modelId": "basicPage",
    "name": "Basic Page",
    "group": {
      "id": "ascoHub",
      "name": "ASCO Hub"
    },
    "icon": "far/file-word",
    "description": "To use for basic content pages.",
    "singularApiName": "BasicPage",
    "pluralApiName": "BasicPages",
    "fields": [
        {
            "multipleValues": false,
            "listValidation": [],
            "settings": {},
            "renderer": {
                "name": "text-input"
            },
            "helpText": null,
            "predefinedValues": {
                "enabled": false,
                "values": []
            },
            "label": "Page Title",
            "type": "text",
            "tags": [],
            "placeholderText": null,
            "id": "pageTitle",
            "validation": [
                {
                    "name": "required",
                    "message": "Title is a required field.",
                    "settings": {}
                }
            ],
            "fieldId": "pageTitle"
        },
        {
            "multipleValues": false,
            "listValidation": [],
            "settings": {},
            "renderer": {
                "name": "text-input"
            },
            "helpText": null,
            "predefinedValues": {
                "enabled": false,
                "values": []
            },
            "label": "URL Path",
            "type": "text",
            "tags": [],
            "placeholderText": null,
            "id": "urlPath",
            "validation": [
                {
                    "name": "required",
                    "message": "Value is required.",
                    "settings": {}
                },
                {
                    "name": "unique",
                    "message": "Value must be unique.",
                    "settings": {}
                }
            ],
            "fieldId": "urlPath"
        },
        {
            "multipleValues": false,
            "listValidation": [],
            "settings": {},
            "renderer": {
                "name": "select-box"
            },
            "helpText": "Select one site where this page will appear, such as asco.org.",
            "predefinedValues": {
                "enabled": true,
                "values": [
                    {
                        "value": "SOCIETY",
                        "selected": true,
                        "label": "ASCO.org"
                    },
                    {
                        "value": "ASSN",
                        "selected": true,
                        "label": "ASCO Assn"
                    },
                    {
                        "value": "AM",
                        "selected": false,
                        "label": "Annual Meeting"
                    },
                    {
                        "value": "GI",
                        "selected": false,
                        "label": "GI Meeting"
                    },
                    {
                        "value": "GU",
                        "selected": false,
                        "label": "GU Meeting"
                    },
                    {
                        "value": "QCS",
                        "selected": false,
                        "label": "Quality"
                    },
                    {
                        "value": "BKT",
                        "selected": false,
                        "label": "Breakthrough"
                    },
                    {
                        "value": "BOA",
                        "selected": false,
                        "label": "Best of ASCO"
                    }
                ]
            },
            "label": "Site Picker",
            "type": "text",
            "tags": [],
            "placeholderText": null,
            "id": "sitePicker",
            "validation": [],
            "fieldId": "sitePicker"
        },
        {
            "multipleValues": true,
            "listValidation": [],
            "settings": {},
            "renderer": {
                "name": "lexical-text-inputs"
            },
            "helpText": null,
            "predefinedValues": {
                "enabled": false,
                "values": []
            },
            "label": "Body",
            "type": "rich-text",
            "tags": [],
            "placeholderText": null,
            "id": "fullBody",
            "validation": [],
            "fieldId": "fullBody"
        },
        {
            "multipleValues": false,
            "listValidation": [],
            "settings": {},
            "renderer": {
                "name": "long-text-text-area"
            },
            "helpText": null,
            "predefinedValues": {
                "enabled": false,
                "values": []
            },
            "label": "Summary",
            "type": "long-text",
            "tags": [],
            "placeholderText": null,
            "id": "summary",
            "validation": [
                {
                    "name": "maxLength",
                    "message": "Value is too long.",
                    "settings": {
                        "value": "250"
                    }
                }
            ],
            "fieldId": "summary"
        }
    ],
    "layout": [
        [
            "pageTitle"
        ],
        [
            "urlPath"
        ],
        [
            "sitePicker"
        ],
        [
            "fullBody"
        ],
        [
            "summary"
        ]
    ],
    "titleFieldId": "pageTitle",
    "descriptionFieldId": "summary"
  })
];
