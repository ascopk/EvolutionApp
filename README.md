# ASCO.webiny

contains infrastructure code hosting the webiny cms platform  

## webiny monorepo

this repo was initially created with `npx create-webiny-project asco.webiny --force`  
manual resources that are not included in the initial webiny deployment are located in `webiny-initial-config.yaml` and created with the aws cloudformation cli
  * example: `aws cloudformation update-stack --stack-name sandbox-webiny-config --template-body file://webiny-config.yaml --parameters ParameterKey=Environment,ParameterValue=sandbox ParameterKey=OIDCProviderArn,ParameterValue="arn:aws:iam::785726936497:oidc-provider/token.actions.githubusercontent.com" --capabilities CAPABILITY_NAMED_IAM`

webiny has four applications in it's platform:
1. core
2. api
3. admin
4. website

deployment **must** occur in the order stated above: `yarn webiny deploy apps/core --env dev`   
ensure that the proper webiny credentials are set in `~/.aws/credentials`  
IAC state is stored in AWS s3. It has to be set as env variable: `WEBINY_PULUMI_BACKEND=s3://wby-sandbox-state`  

## access to webiny

Access to webiny is controlled by the following active directory groups:

* Webiny_Admins
* Webiny_Editor
* Webiny_Approver
* Webiny_MarCom

To request access to Webiny, please open a Jira ticket to the [DEVOPS Jira board](https://asco1.atlassian.net/jira/software/projects/DEVOPS/boards/298/backlog) and request access to one of the active directory groups

## webiny local development

As stated in the [documentation](https://www.webiny.com/docs/core-development-concepts/development/local-development), since Webiny is a serverless platform the backend still must be deployed in the cloud and there is little that can be done locally.

You can deploy a personal webiny environment in your developer AWS account sandbox by using the following steps:

1. In your AWS account (the one with your first and last name), go to `IAM` and select `Roles` from the left menu
2. Search for the role named "webiny-oidc-role" (there will be a random hash at the end of the role name)
3. Copy the ARN of that role
4. Use the [Personal Environment](https://github.com/ascogit/ASCO.webiny/actions/workflows/personal.yml) github actions workflow
5. Insert the role ARN as the `AWS_OIDC_ROLE` parameter and run the workflow
6. When completed, the workflow summary page will show the urls for your own personal Webiny environment

Any changes that need to be deployed in your personal environment can be done by rerunning the [Personal Environment](https://github.com/ascogit/ASCO.webiny/actions/workflows/personal.yml) github actions workflow on your branch

if there are changes to any of the libs (like awslibs or a dependency), please ensure that you run a `yarn install` to update the `yarn.lock` file and check that in to the Pull Reuqest

## cli examples

* list resources: `yarn webiny pulumi apps/core --env dev -- stack --show-ids`
* refresh current state from remote state bucket: `yarn webiny pulumi apps/core --env=dev -- refresh --yes`
* monitoring changes and automatic redeploy: `yarn webiny watch apps/core --env dev`
* custom commands are located in `webiny.project.ts`
* remove resources: `yarn webiny destroy apps/core --env dev`

## webiny control panel

* https://app.webiny.com
* email login with webiny control panel: `webiny-admin@asco.org` (credentials are in lastpass)

## modifying and configuring webiny

1. export needed env variables
  * `AWS_PROFILE`(credentials)
  * `AWS_REGION`
2. Additionally add these environment variables to the `.env` file in the project root:
  * `AWS_REGION`
  * `WEBINY_PULUMI_BACKEND`(IAC state url)
  * `PULUMI_SECRETS_PROVIDER` (passphrase or kms)
  * `PULUMI_CONFIG_PASSPHRASE`(pulumi api token)
  * `OKTA_ISSUER`
  * `DEBUG=true`
2. run `yarn webiny build core,api,admin,website --env sandbox` to build the initial pulumi files
3. confirm the ability to read an existing environment: `yarn webiny info --env=sandbox`
3. modify files and deploy the `yarn webiny deploy apps/website`

## Webiny Deploy Role OIDC

1. Login to aws sso
2. Run the command to create the cloudformation stack. OIDC Identity Provider Arn is a required parameter
```
aws cloudformation create-stack \
--stack-name webiny-deploy-role-$env \
--template-body file://webiny-aws-role.yaml \
--parameters ParameterKey=OIDCProviderArn,ParameterValue=${ProviderArn} \
--capabilities CAPABILITY_NAMED_IAM
```

## resources

* [webiny cli](https://www.webiny.com/docs/core-development-concepts/basics/webiny-cli)
* [custom webiny cli commands](https://www.webiny.com/docs/core-development-concepts/extending-and-customizing/adding-custom-cli-commands)
* [modifying webiny infrasturcture](https://www.webiny.com/docs/infrastructure/basics/modify-cloud-infrastructure)
* [local development](https://www.webiny.com/docs/core-development-concepts/development/local-development)
