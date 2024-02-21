import { createCoreApp } from "@webiny/serverless-cms-aws/enterprise";
import { awsconfig, ascoEnvs, ascoProdEnvs } from 'awsconfig'

export default createCoreApp({
    pulumiResourceNamePrefix: "wby-",
    productionEnvironments: ascoProdEnvs,
    openSearch: true,
    
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
    }
});