import { Config } from "sst/node/config";
import { z } from "zod";
import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

class AuthProvider {
  private cognitoClient: CognitoIdentityProviderClient;
  constructor() {
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: Config.REGION,
    });
  }
}

export { AuthProvider };
