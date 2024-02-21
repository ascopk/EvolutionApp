import { createApiApp } from "@webiny/serverless-cms-aws/enterprise";
import { awsconfig, ascoEnvs, ascoProdEnvs } from 'awsconfig';

export default createApiApp({
    pulumiResourceNamePrefix: "wby-",
    productionEnvironments: ascoProdEnvs,
    elasticSearch: true,

    vpc: ({ params }) => {
        const { env } = params.run
        let awsEnv = env 
        if (!ascoEnvs.includes(env)){ awsEnv = "sandbox" }
        return { 
            useExistingVpc: {
                elasticSearchDomainVpcConfig: {
                    subnetIds: awsconfig[awsEnv].subnets,
                    securityGroupIds: awsconfig[awsEnv].securitygroups
                },
                lambdaFunctionsVpcConfig: {
                    subnetIds: awsconfig[awsEnv].subnets,
                    securityGroupIds: awsconfig[awsEnv].securitygroups
                }
            }
        }
    },

    pulumi({ resources, params }) {
        const { cloudfront } = resources;
        const { env } = params.run

        let awsEnv = env 
        cloudfront.config.comment(`${env} webiny api`)
        // cloudfront.config.aliases([`webiny-api.${env}.asco.org`])
        cloudfront.config.aliases([`${env}-webiny-api.asco.org`])
        if (!ascoEnvs.includes(env)){
            cloudfront.config.aliases([])
            awsEnv = "sandbox"
        }

        cloudfront.config.webAclId(awsconfig[awsEnv].waf)
        cloudfront.config.viewerCertificate(config => {
            return { ...config, 
                acmCertificateArn: awsconfig[awsEnv].cert,
                minimumProtocolVersion: awsconfig[awsEnv].tls,
                sslSupportMethod: "sni-only" 
            }
        })
    }
});