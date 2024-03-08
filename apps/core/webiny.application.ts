import { createCoreApp } from "@webiny/serverless-cms-aws/enterprise";
import { awsconfig, ascoEnvs, ascoProdEnvs } from 'awsconfig'

export default createCoreApp({
    pulumiResourceNamePrefix: "wby-",
    productionEnvironments: ascoProdEnvs,
    openSearch: true,
    
    vpc: ({ params }) => {
        const { env } = params.run

        if (ascoEnvs.includes(env)){
            return { 
                useExistingVpc: {
                    elasticSearchDomainVpcConfig: {
                        subnetIds: awsconfig[env].subnets,
                        securityGroupIds: awsconfig[env].securitygroups
                    },
                    lambdaFunctionsVpcConfig: {
                        subnetIds: awsconfig[env].subnets,
                        securityGroupIds: awsconfig[env].securitygroups
                    }
                }
            }
        }
    }
});
