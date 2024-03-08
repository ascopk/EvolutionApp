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

        cloudfront.config.comment(`${env} webiny api`)

        if (ascoEnvs.includes(env)) {
            cloudfront.config.aliases([`${env}-webiny-api.asco.org`])
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
