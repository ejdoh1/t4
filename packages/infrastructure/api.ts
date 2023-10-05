import { constants } from "@t4/constants";
import { Api, Stack } from "sst/constructs";
import { SSTConstruct } from "sst/constructs/Construct";

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
      authorizer: "Authorizer",
    },
    routes: {
      "ANY /api/v0.0.1/{proxy+}": "packages/api/index.handlerV0_0_1",
    },
    authorizers: {
      Authorizer: {
        type: "user_pool",
        userPool: {
          id: userPoolId,
          clientIds: [userPoolClientId],
        },
      },
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
  return {
    api,
  };
}
