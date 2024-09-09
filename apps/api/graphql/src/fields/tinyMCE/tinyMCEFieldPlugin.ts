import { CmsModelFieldToGraphQLPlugin } from "@webiny/api-headless-cms/types";

const plugin: CmsModelFieldToGraphQLPlugin = {
  name: "cms-model-field-to-graphql-tinymce",
  type: "cms-model-field-to-graphql",
  fieldType: "tinymce",
  isSortable: false,
  isSearchable: false,
  read: {
    createTypeField({ field }) {
      return `${field.fieldId}: String`;
    },
    createGetFilters({ field }) {
      return `${field.fieldId}: String`;
    }
  },
  manage: {
    createTypeField({ field }) {
      return `${field.fieldId}: String`;
    },
    createInputField({ field }) {
      return field.fieldId + ": String";
    }
  }
};

export default plugin;
