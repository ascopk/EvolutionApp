# ASCO.webiny

contains infrastructure code hosting the webiny cms platform  

## webiny monorepo

this repo was initially created with `npx create-webiny-project asco.webiny --force`  
manual resources that are not included in the initial webiny deployment are located in `webiny-aws-config.yaml` and created with the aws cloudformation cli
  * example: `aws cloudformation update-stack --stack-name sandbox-webiny-aws-config --template-body file://webiny-aws-config.yaml --parameters ParameterKey=Environment,ParameterValue=sandbox --capabilities CAPABILITY_NAMED_IAM` 

webiny has four applications in it's platform:
1. core
2. api
3. admin
4. website

deployment **must** occur in the order stated above: `yarn webiny deploy apps/core --env dev`   
ensure that the proper webiny credentials are set in `~/.aws/credentials`  
IAC state is stored in AWS s3. It has to be set as env variable: `WEBINY_PULUMI_BACKEND=s3://wby-sandbox-state`  

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

## resources

* [webiny cli](https://www.webiny.com/docs/core-development-concepts/basics/webiny-cli)
* [custom webiny cli commands](https://www.webiny.com/docs/core-development-concepts/extending-and-customizing/adding-custom-cli-commands)
* [modifying webiny infrasturcture](https://www.webiny.com/docs/infrastructure/basics/modify-cloud-infrastructure)
* [local development](https://www.webiny.com/docs/core-development-concepts/development/local-development)