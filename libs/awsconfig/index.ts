type awsResourceArns = {
    [environment: string]: {
      cert: string,
      tls: string,
      subnets: string[],
      securitygroups: string[];
      waf: string,
      eventbus: string,
      comment?: string
    }
  }
  
  const ascoEnvs: string[] = ["sandbox", "dev", "stage", "prod"]
  const ascoProdEnvs: string[] = ["stage", "prod"]
  const tlsVersion = "TLSv1.2_2021"
  
  const awsconfig: awsResourceArns = {
    "sandbox":{
      "cert": "arn:aws:acm:us-east-1:785726936497:certificate/7b9445fa-4876-42ad-8f7c-d41012bce198",
      "tls": tlsVersion,
      "subnets": ["subnet-0a418b20378c2543e"],
      "securitygroups": ["sg-06a55a730b1bfeeb9"],
      "waf": "arn:aws:wafv2:us-east-1:785726936497:global/webacl/sand-meeting-program-view-application/7c2d1e8c-fdad-4600-9078-289bcf63b196",
      "eventbus": ""
    },
    "dev": {
      "cert": "arn:aws:acm:us-east-1:477761241525:certificate/bc0bc78f-0ad0-4778-abc0-b924f4437d59", //asco.org
      "tls": tlsVersion,
      "subnets": ["subnet-0a418b20378c2543e"], //dev-sharedvpc-private-AZ1
      "securitygroups": ["sg-0bae4e564dc6b2f97"], //dev-hub-LoadBalancerSG
      "waf": "arn:aws:wafv2:us-east-1:477761241525:global/webacl/dev-api/3d149f4e-d593-41aa-80a5-39f64cce0bb8", // dev-api
      "eventbus": "arn:aws:events:us-east-1:477761241525:event-bus/dev-dp-core-eventBus"
    },
    "stage": {
      "cert": "arn:aws:acm:us-east-1:953078433933:certificate/5764fabf-e4dd-4660-8a45-7d6df692cf16", //asco.org
      "tls": tlsVersion,
      "subnets": ["subnet-088c31a9b437252bb","subnet-020410646d1062146","subnet-09f376e1ff1050db2"], //stage-sharedvpc-private-AZ1,AZ2,AZ3
      "securitygroups": ["sg-08dc1998e9fb9dc01"], //stage-hub-LoadBalancerSG
      "waf": "arn:aws:wafv2:us-east-1:953078433933:global/webacl/stage-api/acd376d5-ee27-4afd-b3f6-41effb6957b3", // stage-api
      "eventbus": "arn:aws:events:us-east-1:953078433933:event-bus/stage-dp-core-eventBus"
    },
    "prod": {
      "cert": "arn:aws:acm:us-east-1:121566555105:certificate/f1d38be1-6945-42f8-80e9-6dd8bc0ae010", //asco.org
      "tls": tlsVersion,
      "subnets": ["subnet-04272464b2fc3b352","subnet-0cda55c6c3bfc9b4f","subnet-0adcb674030a6f800"], //prod-sharedvpc-private-AZ1,AZ2,AZ3
      "securitygroups": ["sg-03aaa4423c97da278"], //prod-hub-LoadBalancerSG
      "waf": "arn:aws:wafv2:us-east-1:121566555105:global/webacl/prod-api/6c9072ff-2746-4776-927d-6d6b90e481a5", // prod-api
      "eventbus": "arn:aws:events:us-east-1:121566555105:event-bus/prod-dp-core-eventBus"
    }
  }
  
  export { 
    awsconfig, 
    ascoEnvs,
    ascoProdEnvs
  }
