import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  itemSchema,
  createItemRequestSchema,
  CreateItemRequest,
  itemsSchema,
} from "@t4/types";
import { ItemsDataStore } from "@t4/datastore";
import { z } from "zod";

const itemDs = new ItemsDataStore();

const itemsRouter = createTRPCRouter({
  listItems: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/items",
        tags: ["Items"],
        summary: "List items",
      },
    })
    .input(z.void())
    .output(itemsSchema)
    .query(async (args) => {
      return await itemDs.list({
        sub: args.ctx.sub,
      });
    }),
  deleteItem: publicProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: "/items/{itemId}",
        tags: ["Items"],
        summary: "Delete an item",
      },
    })
    .input(
      z.object({
        itemId: z.string().uuid(),
      })
    )
    .output(
      z.object({
        success: z.boolean(),
      })
    )
    .mutation(async (args) => {
      try {
        await itemDs.delete({
          id: args.input.itemId,
          sub: args.ctx.sub,
        });
      } catch (e) {
        return {
          success: false,
        };
      }
      return {
        success: true,
      };
    }),
  createItem: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/items",
        tags: ["Items"],
        summary: "Create a new item",
      },
    })
    .input(createItemRequestSchema)
    .output(itemSchema)
    .mutation(async (args) => {
      const request = createItemRequestSchema.parse({
        ...args.input,
      } satisfies CreateItemRequest);
      return await itemDs.create({
        request,
        sub: args.ctx.sub,
      });
    }),
});

export default itemsRouter;
