import { itemsSchema } from "@t4/types";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { ItemsDataStore } from "@t4/datastore";

const ds = new ItemsDataStore();

const router = createTRPCRouter({
  list: protectedProcedure.output(itemsSchema).query(
    async (args) =>
      await ds.list({
        sub: args.ctx.session.user.id,
      }),
  ),
});

export default router;
