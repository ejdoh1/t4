import { initTRPC } from "@trpc/server";
import {
  APIGatewayEvent,
  CreateAWSLambdaContextOptions,
} from "@trpc/server/adapters/aws-lambda";
import { OpenApiMeta } from "trpc-openapi";
import { v4 as uuid } from "uuid";

export type Context = {
  requestId: string;
};

const t = initTRPC
  .context<Context>()
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

export const createContext = async ({
  event,
  context,
}: // eslint-disable-next-line @typescript-eslint/require-await
CreateAWSLambdaContextOptions<APIGatewayEvent>): Promise<Context> => {
  const requestId = uuid();
  return { requestId };
};

export const publicProcedure = t.procedure;

export const createTRPCRouter = t.router;
