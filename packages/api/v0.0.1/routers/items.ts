import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  itemSchema,
  createItemRequestSchema,
  CreateItemRequest,
} from "@t4/types";
import { ItemsDataStore } from "@t4/datastore";

const itemDs = new ItemsDataStore();

const itemsRouter = createTRPCRouter({
  // listItems: publicProcedure
  //   .meta({
  //     openapi: {
  //       method: "GET",
  //       path: "/items",
  //       tags: ["Items"],
  //       summary: "Get all items",
  //     },
  //   })
  //   .output(itemSchema.array())
  //   .query(
  //     async () =>
  //       await itemDs.list({
  //         sub: "test",
  //       })
  //   ),
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
      return await itemDs.create({
        request,
        sub: "test",
      });
    }),
});

export default itemsRouter;
