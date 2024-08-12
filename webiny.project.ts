import cliWorkspaces from "@webiny/cli-plugin-workspaces";
import cliPulumiDeploy from "@webiny/cli-plugin-deploy-pulumi";
import cliAwsTemplate from "@webiny/cwp-template-aws/cli";

// Scaffolds.
import cliScaffold from "@webiny/cli-plugin-scaffold";
import cliScaffoldExtendGraphQlApi from "@webiny/cli-plugin-scaffold-graphql-service";
import cliScaffoldAdminModule from "@webiny/cli-plugin-scaffold-admin-app-module";
import cliScaffoldCiCd from "@webiny/cli-plugin-scaffold-ci";
import cliScaffoldExtensions from "@webiny/cli-plugin-scaffold-extensions";
import cliScaffoldWorkspaces from "@webiny/cli-plugin-scaffold-workspaces";

export default {
    template: "@webiny/cwp-template-aws@5.39.1",
    name: "asco.webiny",
    cli: {
        plugins: [
            cliWorkspaces(),
            cliPulumiDeploy(),
            cliAwsTemplate(),

            // Scaffolds.
            cliScaffold(),
            cliScaffoldWorkspaces(),
            cliScaffoldExtensions(),
            cliScaffoldExtendGraphQlApi(),
            cliScaffoldAdminModule(),
            cliScaffoldCiCd()
        ]
    },
    appAliases: {
        core: "apps/core",
        api: "apps/api",
        admin: "apps/admin",
        website: "apps/website"
    }
};
