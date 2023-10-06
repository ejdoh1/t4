import { Config } from "sst/node/config";
import { z } from "zod";
import {
  CognitoIdentityProviderClient,
  CreateUserPoolClientCommand,
  CreateUserPoolClientCommandInput,
  // ListUserPoolClientsCommand,
  // ListUserPoolClientsCommandInput,
  DescribeUserPoolClientCommand,
  DescribeUserPoolClientCommandInput,
} from "@aws-sdk/client-cognito-identity-provider";

class AuthProvider {
  private cognitoClient: CognitoIdentityProviderClient;
  constructor() {
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: Config.REGION,
    });
  }

  createUserPoolClient = z
    .function()
    .args(z.object({ clientName: z.string() }))
    .implement(async (args) => {
      const command = new CreateUserPoolClientCommand({
        GenerateSecret: true,
        SupportedIdentityProviders: ["COGNITO"],
        UserPoolId: Config.USER_POOL_ID,
        ClientName: args.clientName,
        AllowedOAuthFlows: ["client_credentials"],
        AllowedOAuthScopes: ["t4/items:write", "t4/items:read"],
      } satisfies CreateUserPoolClientCommandInput);
      return await this.cognitoClient.send(command);
    });

  getUserPoolClientSecret = z
    .function()
    .args(z.object({ clientId: z.string() }))
    .implement(async (args) => {
      const command = new DescribeUserPoolClientCommand({
        ClientId: args.clientId,
        UserPoolId: Config.USER_POOL_ID,
      } satisfies DescribeUserPoolClientCommandInput);
      const response = await this.cognitoClient.send(command);
      return response.UserPoolClient?.ClientSecret;
    });
}

export { AuthProvider };
