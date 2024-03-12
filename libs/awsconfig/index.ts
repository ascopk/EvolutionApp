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
      // "subnets": ["subnet-0a418b20378c2543e","subnet-0966f12c812d6f7fc","subnet-01d9ce93c27696082"],
      "subnets": ["subnet-0a418b20378c2543e"],
      "securitygroups": ["sg-06a55a730b1bfeeb9"],
      "waf": "arn:aws:wafv2:us-east-1:785726936497:global/webacl/sand-meeting-program-view-application/7c2d1e8c-fdad-4600-9078-289bcf63b196",
    },
    "dev": {
      "cert": "arn:aws:acm:us-east-1:477761241525:certificate/bc0bc78f-0ad0-4778-abc0-b924f4437d59",
      "tls": tlsVersion,
      "subnets": ["subnet-0a418b20378c2543e"],
      "securitygroups": ["sg-0bae4e564dc6b2f97"],
      "waf": "arn:aws:wafv2:us-east-1:477761241525:global/webacl/dev-hub-application/f937f77c-6371-4d1a-b709-a7b9b09ecd33",
    },
    "stage": {
      "cert": "",
      "tls": tlsVersion,
      "subnets": [],
      "securitygroups": [],
      "waf": ""
    },
    "prod": {
      "cert": "",
      "tls": tlsVersion,
      "subnets": [],
      "securitygroups": [],
      "waf": ""
    }
  }
  
  export { 
    awsconfig, 
    ascoEnvs,
    ascoProdEnvs
  }
