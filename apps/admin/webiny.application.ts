import { createAdminApp } from "@webiny/serverless-cms-aws/enterprise";
import { awsconfig, ascoEnvs, ascoProdEnvs } from 'awsconfig';

export default createAdminApp({
    pulumiResourceNamePrefix: "wby-",
    productionEnvironments: ascoProdEnvs,
    
    pulumi({ resources, params }) {
        const { cloudfront } = resources;
        const { env } = params.run

        let awsEnv = env 
        cloudfront.config.comment(`${env} webiny admin`)
        // cloudfront.config.aliases([`webiny-admin.${env}.asco.org`])
        cloudfront.config.aliases([`${env}-webiny-admin.asco.org`])
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
})