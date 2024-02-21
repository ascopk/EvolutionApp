import { createWebsiteApp } from "@webiny/serverless-cms-aws/enterprise";
import { awsconfig, ascoEnvs, ascoProdEnvs } from 'awsconfig'

export default createWebsiteApp({
    pulumiResourceNamePrefix: "wby-",
    productionEnvironments: ascoProdEnvs,

    vpc: ({ params }) => {
        const { env } = params.run
        let awsEnv = env 
        if (!ascoEnvs.includes(env)){ awsEnv = "sandbox" }
        return { 
             useExistingVpc: {
                 lambdaFunctionsVpcConfig: {
                     subnetIds: awsconfig[awsEnv].subnets,
                     securityGroupIds: awsconfig[awsEnv].securitygroups
                 }
             }
         }
    },

    pulumi({ resources, params }) {
        const { env } = params.run
        let awsEnv = env
        const deployables = [
            {name: "preview", deploy: resources.preview}, 
            {name: "delivery", deploy: resources.delivery}
        ]

        deployables.forEach((each) => {
            each.deploy.cloudfront.config.comment(`${env} webiny ${each.name}`)
            switch(each.name){
                case "preview":
                    // each.deploy.cloudfront.config.aliases([`webiny-preview.${env}.asco.org`])
                    each.deploy.cloudfront.config.aliases([`${env}-webiny-preview.asco.org`])
                    break;
                case "delivery":
                    // each.deploy.cloudfront.config.aliases([`webiny.${env}.asco.org`])
                    each.deploy.cloudfront.config.aliases([`${env}-webiny.asco.org`])
            }

            if (!ascoEnvs.includes(env)){
                each.deploy.cloudfront.config.aliases([])
                awsEnv = "sandbox"
            }

            each.deploy.cloudfront.config.webAclId(awsconfig[awsEnv].waf)
            each.deploy.cloudfront.config.viewerCertificate(config => {
                return { ...config, 
                    acmCertificateArn: awsconfig[awsEnv].cert,
                    minimumProtocolVersion: awsconfig[awsEnv].tls,
                    sslSupportMethod: "sni-only" 
                }
            })
      })

    }
});