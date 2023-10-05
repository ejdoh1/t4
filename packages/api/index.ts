import { createOpenApiAwsLambdaHandler } from "trpc-openapi";
import { router as appRouterV0_0_1 } from "./v0.0.1/root";
import { createContext as createContextV0_0_1 } from "./v0.0.1/trpc";

// Handle incoming OpenAPI requests
export const handlerV0_0_1 = createOpenApiAwsLambdaHandler({
  router: appRouterV0_0_1,
  createContext: createContextV0_0_1,
});
