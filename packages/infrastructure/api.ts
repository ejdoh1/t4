import { Config } from "sst/constructs";
import { constants } from "@t4/constants";
import { Api, Stack, Function } from "sst/constructs";
import { SSTConstruct } from "sst/constructs/Construct";
import { paramNames } from "@t4/constants";

export function apiStack(
  stack: Stack,
  binds: SSTConstruct[],
  userPoolId: string,
  userPoolClientId: string
) {
  const customBinds = [...binds];

  const api = new Api(stack, constants.enum.apiStackId, {
    defaults: {
      function: {
        timeout: 20,
        runtime: "nodejs18.x",
        bind: customBinds,
      },
      authorizer: "myAuthorizer",
    },
    routes: {
      "ANY /api/v0.0.1/{proxy+}": "packages/api/index.handlerV0_0_1",
    },
    authorizers: {
      myAuthorizer: {
        type: "lambda",
        function: new Function(stack, "Authorizer", {
          handler: "packages/authorizer/main.handler",
          bind: customBinds,
          permissions: ["cognito-idp:*"],
        }),
        resultsCacheTtl: "30 seconds",
      },
    },
  });

  // api.attachPermissions(["cognito-idp:*"]);

  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  const apiEndpointUrl = new Config.Parameter(
    stack,
    paramNames.enum.apiEndpointUrl,
    {
      value: api.url,
    }
  );

  return {
    api,
    apiEndpointUrl,
  };
}
