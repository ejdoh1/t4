import { initTRPC } from "@trpc/server";
import {
  APIGatewayEvent,
  CreateAWSLambdaContextOptions,
} from "@trpc/server/adapters/aws-lambda";
import { OpenApiMeta } from "trpc-openapi";

export type Context = {
  sub: string;
};

export const createContext = async ({
  event,
  context,
}: // eslint-disable-next-line @typescript-eslint/require-await
CreateAWSLambdaContextOptions<APIGatewayEvent>): Promise<Context> => {
  const sub = event.requestContext.authorizer.lambda.sub;
  return { sub };
};

const t = initTRPC
  .context<typeof createContext>()
  .meta<OpenApiMeta>()
  .create({
    errorFormatter: ({ error, shape }) => {
      if (
        error.code === "INTERNAL_SERVER_ERROR" &&
        process.env.NODE_ENV === "production"
      ) {
        return { ...shape, message: "Internal server error" };
      }
      return shape;
    },
  });

export const publicProcedure = t.procedure;

export const createTRPCRouter = t.router;
