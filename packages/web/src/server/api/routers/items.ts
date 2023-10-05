import { itemsSchema, itemSchema, createItemRequestSchema } from "@t4/types";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { ItemsDataStore } from "@t4/datastore";
import { z } from "zod";
const ds = new ItemsDataStore();

const router = createTRPCRouter({
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        request: createItemRequestSchema,
      }),
    )
    .output(itemSchema)
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
        request: createItemRequestSchema,
      }),
    )
    .output(itemSchema)
    .mutation(
      async (args) =>
        await ds.create({
          request: args.input.request,
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
