import { createAdminApp } from "@webiny/serverless-cms-aws/enterprise";
import { awsconfig, ascoEnvs, ascoProdEnvs } from 'awsconfig';

export default createAdminApp({
    pulumiResourceNamePrefix: "wby-",
    productionEnvironments: ascoProdEnvs,
    
    pulumi({ resources, params }) {
        const { cloudfront } = resources;
        const { env } = params.run

        cloudfront.config.comment(`${env} webiny admin`)

        if (ascoEnvs.includes(env)){
            cloudfront.config.aliases([`${env}-webiny-admin.asco.org`])
            if (env == "prod"){ cloudfront.config.aliases([`webiny-admin.asco.org`]) }
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
