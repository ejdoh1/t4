import { Config } from "sst/node/config";
import { appsSchema, appSchema, createAppRequestSchema } from "@t4/types";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { AppsDataStore } from "@t4/datastore";
import { AuthProvider } from "@t4/authprovider";
import { z } from "zod";
import { constants } from "@t4/constants";

const ds = new AppsDataStore();
const auth = new AuthProvider();

const router = createTRPCRouter({
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        request: createAppRequestSchema,
      }),
    )
    .output(appSchema)
    .mutation(
      async (args) =>
        await ds.update({
          request: args.input.request,
          sub: args.ctx.session.user.id,
          id: args.input.id,
        }),
    ),
  create: protectedProcedure
    .input(
      z.object({
        request: createAppRequestSchema,
      }),
    )
    .output(appSchema)
    .mutation(async (args) => {
      const apps = await ds.list({
        sub: args.ctx.session.user.id,
      });

      if (apps.length >= constants.enum.appsCountLimit) {
        throw new Error("Maximum number of apps reached");
      }

      const userPoolClient = await auth.createUserPoolClient({
        clientName: args.ctx.session.user.id,
      });
      if (!userPoolClient.UserPoolClient?.ClientId) {
        throw new Error("User pool client not created");
      }
      const response = await ds.create({
        request: args.input.request,
        sub: args.ctx.session.user.id,
        id: userPoolClient.UserPoolClient?.ClientId,
      });
      return response;
    }),
  list: protectedProcedure.output(appsSchema).query(async (args) => {
    const response = await ds.list({
      sub: args.ctx.session.user.id,
    });
    return response;
  }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async (args) => {
      await auth.deleteUserPoolClient({
        clientId: args.input.id,
      });
      await ds.delete({
        id: args.input.id,
        sub: args.ctx.session.user.id,
      });
    }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .output(appSchema)
    .query(
      async (args) =>
        await ds.get({
          id: args.input.id,
          sub: args.ctx.session.user.id,
        }),
    ),
  getClientSecret: protectedProcedure
    .input(z.object({ id: z.string() }))
    .output(z.string())
    .query(async (args) => {
      const client = await auth.describeUserPoolClient({
        clientId: args.input.id,
      });
      if (!client.ClientSecret) {
        throw new Error("Client secret not found");
      }
      if (client.ClientName !== args.ctx.session.user.id) {
        throw new Error("Client does not belong to user");
      }
      return client.ClientSecret;
    }),
  getApiUrl: protectedProcedure.query(() => Config.API_ENDPOINT_URL),
  getCognitoDomain: protectedProcedure.query(() => Config.COGNITO_DOMAIN),
});

export default router;
