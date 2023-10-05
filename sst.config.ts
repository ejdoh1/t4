import { SSTConfig } from "sst";
import { authStack, itemsStack } from "@t4/infrastructure";
import { NextjsSite } from "sst/constructs";
import { constants } from "@t4/constants";

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
      const auth = authStack(stack);
      const items = itemsStack(stack);

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
        ],
        environment: {
          NEXTAUTH_URL: nextAuthUrl,
          NEXTAUTH_SECRET: constants.enum.nextAuthSecret,
        },
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
