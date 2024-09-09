import * as aws from "@pulumi/aws";
import { createApiApp } from "@webiny/serverless-cms-aws/enterprise";
import { awsconfig, ascoEnvs, ascoProdEnvs } from 'awsconfig';

export default createApiApp({
    pulumiResourceNamePrefix: "wby-",
    productionEnvironments: ascoProdEnvs,
    openSearch: true,

    vpc: ({ params }) => {
        const { env } = params.run
        if (ascoEnvs.includes(env)){
            return { 
                useExistingVpc: {
                    lambdaFunctionsVpcConfig: {
                        subnetIds: awsconfig[env].subnets,
                        securityGroupIds: awsconfig[env].securitygroups
                    }
                }
            }
        }
    },

    pulumi({ resources, params }) {
        const { cloudfront } = resources;
        const { env } = params.run

        // Add permissions to PutEvents in dp-core-eventBus
        const putEventsPolicy = new aws.iam.Policy("wby-policy-putevent", {
        description: "This policy grants PutEvents permission on the dp eventBus",
        policy: {
            Version: "2012-10-17",
            Statement: [{
                Effect: "Allow",
                Action: ["events:PutEvents"],
                Resource: ["arn:aws:events:*:*:event-bus/*-dp-core-eventBus"]
            }]
        }});

        new aws.iam.RolePolicyAttachment("graphql-role-event-putevents-attachment", {
            role: resources.graphql.role.output.name,
            policyArn: putEventsPolicy.arn
        });

        cloudfront.config.comment(`${env} webiny api`)

        if (ascoEnvs.includes(env)) {
            cloudfront.config.aliases([`cms-api.${env}.asco.org`])
            if (env == "prod"){ cloudfront.config.aliases([`cms-api.prod.asco.org`]) }
            cloudfront.config.webAclId(awsconfig[env].waf)
            cloudfront.config.viewerCertificate(config => {
                return { ...config, 
                    acmCertificateArn: awsconfig[env].cert,
                    minimumProtocolVersion: awsconfig[env].tls,
                    sslSupportMethod: "sni-only" 
                }
            })
        }
    }
});
