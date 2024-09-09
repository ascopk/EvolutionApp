import richTextEditor from "./headlessCMS/richTextEditor";
import tinyMCEFieldPlugin from "./headlessCMS/fields/tinyMCE/tinyMCEFieldPlugin";
import tinyMCEFieldRendererPlugin from "./headlessCMS/fields/tinyMCE/tinyMCEFieldRendererPlugin";

export default [richTextEditor, tinyMCEFieldPlugin, tinyMCEFieldRendererPlugin()];
