import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  itemSchema,
  createItemRequestSchema,
  CreateItemRequest,
} from "@t4/types";
import { ItemsDataStore } from "@t4/datastore";

const itemDs = new ItemsDataStore();

const itemsRouter = createTRPCRouter({
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
    .mutation(async ({ input }) => {
      const request = createItemRequestSchema.parse({
        ...input,
      } satisfies CreateItemRequest);
      return itemDs.create({
        request,
        sub: "test",
      });
    }),
});

export default itemsRouter;
