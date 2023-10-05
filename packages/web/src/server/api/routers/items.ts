import { itemsSchema, itemSchema } from "@t4/types";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { ItemsDataStore } from "@t4/datastore";
import { z } from "zod";
const ds = new ItemsDataStore();

const router = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        description: z.string().min(1).max(255),
      }),
    )
    .output(itemSchema)
    .mutation(
      async (args) =>
        await ds.create({
          request: args.input,
          sub: args.ctx.session.user.id,
        }),
    ),

  list: protectedProcedure.output(itemsSchema).query(
    async (args) =>
      await ds.list({
        sub: args.ctx.session.user.id,
      }),
  ),
  delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(
    async (args) =>
      await ds.delete({
        id: args.input.id,
        sub: args.ctx.session.user.id,
      }),
  ),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .output(itemSchema)
    .query(
      async (args) =>
        await ds.get({
          id: args.input.id,
          sub: args.ctx.session.user.id,
        }),
    ),
});

export default router;
