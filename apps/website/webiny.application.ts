import { createWebsiteApp } from "@webiny/serverless-cms-aws/enterprise";
import { awsconfig, ascoEnvs, ascoProdEnvs } from 'awsconfig'

export default createWebsiteApp({
    pulumiResourceNamePrefix: "wby-",
    productionEnvironments: ascoProdEnvs,

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
        const { env } = params.run
        const deployables = [
            {name: "preview", deploy: resources.preview}, 
            {name: "delivery", deploy: resources.delivery}
        ]

        deployables.forEach((each) => {
            each.deploy.cloudfront.config.comment(`${env} webiny ${each.name}`)

            if (ascoEnvs.includes(env)){
                switch(each.name){
                    case "preview":
                        each.deploy.cloudfront.config.aliases([`${env}-webiny-preview.asco.org`])
                        if (env == "prod"){ each.deploy.cloudfront.config.aliases([`webiny-preview.asco.org`]) }
                        break;
                    case "delivery":
                        each.deploy.cloudfront.config.aliases([`${env}-webiny.asco.org`])
                        if (env == "prod"){ each.deploy.cloudfront.config.aliases([`webiny.asco.org`]) }
                        break;
                }
                each.deploy.cloudfront.config.webAclId(awsconfig[env].waf)
                each.deploy.cloudfront.config.viewerCertificate(config => {
                    return { ...config, 
                        acmCertificateArn: awsconfig[env].cert,
                        minimumProtocolVersion: awsconfig[env].tls,
                        sslSupportMethod: "sni-only"
                    }
                })
            }
      })
    }
});
