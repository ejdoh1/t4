import { appsSchema, appSchema, createAppRequestSchema } from "@t4/types";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { AppsDataStore } from "@t4/datastore";
import { AuthProvider } from "@t4/authprovider";
import { z } from "zod";

const ds = new AppsDataStore();
const auth = new AuthProvider();

const router = createTRPCRouter({
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
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
      // const id = uuid
      const userPoolClient = await auth.createUserPoolClient({
        clientName: args.ctx.session.user.id + args.input.request.name,
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
    console.log("list:", args.ctx.session.user.id);
    const response = await ds.list({
      sub: args.ctx.session.user.id,
    });
    return response;
  }),
  delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(
    async (args) =>
      await ds.delete({
        id: args.input.id,
        sub: args.ctx.session.user.id,
      }),
  ),
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
});

export default router;
