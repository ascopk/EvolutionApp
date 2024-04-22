type awsResourceArns = {
    [environment: string]: {
      cert: string,
      tls: string,
      subnets: string[],
      securitygroups: string[];
      waf: string,
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
      "waf": "arn:aws:wafv2:us-east-1:785726936497:global/webacl/sand-meeting-program-view-application/7c2d1e8c-fdad-4600-9078-289bcf63b196"
    },
    "dev": {
      "cert": "arn:aws:acm:us-east-1:477761241525:certificate/bc0bc78f-0ad0-4778-abc0-b924f4437d59", //asco.org
      "tls": tlsVersion,
      "subnets": ["subnet-0a418b20378c2543e"], //dev-sharedvpc-private-AZ1
      "securitygroups": ["sg-0bae4e564dc6b2f97"], //dev-hub-LoadBalancerSG
      "waf": "arn:aws:wafv2:us-east-1:477761241525:global/webacl/dev-hub-application/f937f77c-6371-4d1a-b709-a7b9b09ecd33" //dev-hub-application
    },
    "stage": {
      "cert": "arn:aws:acm:us-east-1:953078433933:certificate/5764fabf-e4dd-4660-8a45-7d6df692cf16", //asco.org
      "tls": tlsVersion,
      "subnets": ["subnet-088c31a9b437252bb","subnet-020410646d1062146","subnet-09f376e1ff1050db2"], //stage-sharedvpc-private-AZ1,AZ2,AZ3
      "securitygroups": ["sg-08dc1998e9fb9dc01"], //stage-hub-LoadBalancerSG
      "waf": "arn:aws:wafv2:us-east-1:953078433933:global/webacl/stage-hub-application/3a32e689-2458-4a98-baa4-f5c1ae28d465" //stage-hub-application
    },
    "prod": {
      "cert": "arn:aws:acm:us-east-1:121566555105:certificate/f1d38be1-6945-42f8-80e9-6dd8bc0ae010", //asco.org
      "tls": tlsVersion,
      "subnets": ["subnet-04272464b2fc3b352","subnet-0cda55c6c3bfc9b4f","subnet-0adcb674030a6f800"], //prod-sharedvpc-private-AZ1,AZ2,AZ3
      "securitygroups": ["sg-03aaa4423c97da278"], //prod-hub-LoadBalancerSG
      "waf": "arn:aws:wafv2:us-east-1:121566555105:global/webacl/prod-hub-application/0e0d047b-56f0-4215-b96c-f44680459318" //prod-hub-application
    }
  }
  
  export { 
    awsconfig, 
    ascoEnvs,
    ascoProdEnvs
  }
