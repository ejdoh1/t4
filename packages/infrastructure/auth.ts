import { Config } from "sst/constructs";
import { type Stack, Cognito } from "sst/constructs";
import { paramNames, constants } from "@t4/constants";
import cognito from "aws-cdk-lib/aws-cognito";

export const authStack = (stack: Stack) => {
  const cognitoStack = new Cognito(stack, constants.enum.authStackId, {
    cdk: {
      userPool: {
        selfSignUpEnabled: false,
      },
    },
  });

  const client = cognitoStack.cdk.userPool.addClient(
    constants.enum.cognitoUserPoolClientId,
    {
      generateSecret: true,
      supportedIdentityProviders: [
        cognito.UserPoolClientIdentityProvider.COGNITO,
      ],
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [
          cognito.OAuthScope.EMAIL,
          cognito.OAuthScope.OPENID,
          cognito.OAuthScope.PROFILE,
        ],
        callbackUrls: [
          `${constants.enum.devUrl}${constants.enum.authCallbackSuffix}`,
          `${constants.enum.nextAuthUrl}${constants.enum.authCallbackSuffix}`,
        ],
      },
    }
  );

  const userPoolId = new Config.Parameter(stack, paramNames.enum.userPoolId, {
    value: cognitoStack.userPoolId,
  });

  const userPoolClientId = new Config.Parameter(
    stack,
    paramNames.enum.userPoolClientId,
    {
      value: client.userPoolClientId,
    }
  );

  const userPoolClientSecret = new Config.Parameter(
    stack,
    paramNames.enum.userPoolClientSecret,
    {
      value: client.userPoolClientSecret.toString(),
    }
  );

  // add domain
  cognitoStack.cdk.userPool.addDomain(constants.enum.userPoolDomainId, {
    cognitoDomain: {
      domainPrefix: `${constants.enum.serviceName}-${stack.stage}`,
    },
  });

  const writeItemsScope = new cognito.ResourceServerScope({
    scopeName: "items:write",
    scopeDescription: "Write items",
  });

  const readItemsScope = new cognito.ResourceServerScope({
    scopeName: "items:read",
    scopeDescription: "Read items",
  });

  const resourceServer = new cognito.UserPoolResourceServer(
    stack,
    constants.enum.resourceServerId,
    {
      identifier: constants.enum.resourceServerIdentifier,
      userPool: cognitoStack.cdk.userPool,
      scopes: [writeItemsScope, readItemsScope],
    }
  );

  // const scope = cognito.OAuthScope.resourceServer(
  //   resourceServer,
  //   writeItemsScope
  // );
  // scope.scopeName

  return {
    cognitoStack,
    userPoolId,
    userPoolClientId,
    userPoolClientSecret,
    resourceServer,
  };
};
