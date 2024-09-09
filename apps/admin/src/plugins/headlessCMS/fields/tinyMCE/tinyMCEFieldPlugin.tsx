import React from "react";
import { CmsModelFieldTypePlugin } from "@webiny/app-headless-cms/types";

const TextIcon: React.FunctionComponent = () => <i>icon</i>;

const plugin: CmsModelFieldTypePlugin = {
  type: "cms-editor-field-type",
  name: "cms-editor-field-type-tinymce",
  field: {
    type: "tinymce",
    label: "TinyMCE Rich Text Editor",
    description: "Text formatting with TinyMCE",
    icon: <TextIcon />,
    allowMultipleValues: false,
    allowPredefinedValues: false,
    createField() {
      return {
        type: this.type,
        validation: [],
        renderer: {
          name: ""
        }
      };
    }
  }
};

export default plugin;
