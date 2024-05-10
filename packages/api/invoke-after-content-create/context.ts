import { ContextPlugin } from "@webiny/api/plugins/ContextPlugin";
// import { LambdaClient, InvokeCommand } from "@webiny/aws-sdk/client-lambda";
import { ContentCreateContext } from "./types";

/**
 * This is hardcoded arn for function, have to figure out a way to handle this dynamically
 */
// const lambdaArn = "arn:aws:lambda:us-east-1:381492018416:function:webiny-test";

export const createContext = () => {
    return new ContextPlugin<ContentCreateContext>(async context =>{
        /**
         * Subscribe to onEntryAfterCreate to invoke lambda function
         */
        context.cms.onEntryAfterCreate.subscribe(async ({ model, entry }) => {
            try {
                // Add required lambda function here
                // const lambdaClient = new LambdaClient({ region: process.env.AWS_REGION })
                // const response = await lambdaClient.send(
                //     new InvokeCommand({
                //         FunctionName: lambdaArn,
                //         InvocationType: "RequestResponse",
                //         Payload:JSON.stringify({
                //           model,
                //           entry
                //         })
                //     })
                // )

                // /**
                //  * Extract response from lambda, not sure what to do with it as of now
                //  */
                // const decoder = new TextDecoder('utf-8');
                // return JSON.parse(decoder.decode(response.Payload));
            }catch(e){
                throw new Error("ContentAfterCreate::Error invoking lambda function: " + e);
            }
        })
    }
);}