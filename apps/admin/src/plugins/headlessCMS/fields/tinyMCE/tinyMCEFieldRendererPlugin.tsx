import React, {useRef, useCallback} from "react";
import { Editor } from '@tinymce/tinymce-react';
import {Editor as TinyMCEEditor} from 'tinymce'
import { CmsModelFieldRendererPlugin } from "@webiny/app-headless-cms/types";
import { FormElementMessage } from "@webiny/ui/FormElementMessage";
import * as tinymce_script from './tinymce_7.3.0.min.js';

export default (): CmsModelFieldRendererPlugin => ({  
  type: "cms-editor-field-renderer",
  name: "cms-editor-field-renderer-tinymce",
  renderer: {
    rendererName: "tinymce",
    name: `Rich Text Editor`, 
    description: `Uses TinyMCE to render text`,
    canUse({ field }) {
      return field.type === "tinymce" && !field.multipleValues;
    },
    render({ field, getBind, Label }) {
      const Bind = getBind();
      const editorRef = useRef<TinyMCEEditor | null>(null);

      return (
        <Bind>
          {bind => {

            const onChangeWithCallback = useCallback((htmlString: string) => {
              if (!htmlString || htmlString == "") {
                return;
              }
              bind.onChange(htmlString)
            }, [bind.onChange])

            return (
              <>
                <Label>{field.label}</Label>
                <Editor
                  tinymceScriptSrc={tinymce_script}
                  licenseKey="gpl"
                  value={bind.value ? bind.value : ''}
                  onInit={(_, editor) => editorRef.current = editor}
                  onEditorChange={(editorValue) => onChangeWithCallback(editorValue)}
                  init={{
                    height: 500,
                    menubar: true,
                    plugins: [
                      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                      'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                      'bold italic forecolor | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist outdent indent | ' +
                      'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                  }}
                />
                <FormElementMessage>{field.helpText}</FormElementMessage>
              </>
            )}
          }
        </Bind>
      );
    }
  }
});
