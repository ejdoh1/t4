import { z } from "zod";

export const constants = z.nativeEnum({
  serviceName: "t4",
  displayName: "T4",
  region: "ap-southeast-2",
  profile: "replace_me",
  prodStageName: "prod",
  devStageName: "dev",
  devUrl: "http://localhost:3000",
  nextjsSitePath: "packages/web",
  nextAuthSecret: "HTZioxu3HxhIq/Q2WUKHQuW7tgIL51NmZHSio3YyBDQ=",
  nextAuthUrl: "https://____REPLACE_ME____.cloudfront.net",
  authCallbackSuffix: "/api/auth/callback/cognito",
  authStackId: "Auth",
  apiStackId: "Api",
  cognitoUserPoolClientId: "UserPoolClient",
  nextjsSiteId: "site",
  userPoolDomainId: "UserPoolDomain",
  resourceServerId: "ResourceServer",
  resourceServerIdentifier: "t4",
  appsCountLimit: 2,
});

export const paramNames = z.nativeEnum({
  region: "REGION",
  userPoolId: "USER_POOL_ID",
  userPoolClientId: "USER_POOL_CLIENT_ID",
  userPoolClientSecret: "USER_POOL_CLIENT_SECRET",
  nextAuthSecret: "NEXTAUTH_SECRET",
  apiUrl: "API_URL",
  cognitoDomain: "COGNITO_DOMAIN",
  itemsTableName: "ITEMS_TABLE_NAME",
  appsTableName: "APPS_TABLE_NAME",
  apiEndpointUrl: "API_ENDPOINT_URL",
});

export const tableNames = z.nativeEnum({
  items: "items",
  apps: "apps",
});

export const routes = z.nativeEnum({
  items: "/items",
  home: "/home",
  docs: "/docs",
  apps: "/apps",
});
