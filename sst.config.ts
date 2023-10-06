import { Config } from "sst/constructs";
import { SSTConfig } from "sst";
import { authStack, itemsStack, apiStack } from "@t4/infrastructure";
import { NextjsSite } from "sst/constructs";
import { constants, paramNames } from "@t4/constants";

export default {
  config(_input) {
    return {
      name: constants.enum.serviceName,
      region: constants.enum.region,
      profile: constants.enum.profile,
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const region = new Config.Parameter(stack, paramNames.enum.region, {
        value: constants.enum.region,
      });
      const auth = authStack(stack);
      const items = itemsStack(stack);
      const api = apiStack(
        stack,
        [items.table],
        auth.userPoolId.value,
        auth.userPoolClientId.value
      );

      let nextAuthUrl = constants.enum.nextAuthUrl;
      if (stack.stage !== constants.enum.prodStageName) {
        nextAuthUrl = constants.enum.devUrl;
      }

      const site = new NextjsSite(stack, constants.enum.nextjsSiteId, {
        path: constants.enum.nextjsSitePath,
        bind: [
          auth.userPoolClientId,
          auth.userPoolClientSecret,
          auth.userPoolId,
          items.table,
          items.tableName,
          region,
        ],
        environment: {
          NEXTAUTH_URL: nextAuthUrl,
          NEXTAUTH_SECRET: constants.enum.nextAuthSecret,
        },
      });

      site.attachPermissions(["cognito-idp:*"]);

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
