import itemsRouter from "~/server/api/routers/items";
import appsRouter from "~/server/api/routers/apps";
import apiDocsRouter from "~/server/api/routers/apiDocs";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  items: itemsRouter,
  apps: appsRouter,
  apiDocs: apiDocsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
