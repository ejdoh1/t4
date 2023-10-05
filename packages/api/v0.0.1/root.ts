import { createTRPCRouter } from "./trpc";
import itemsRouter from "./routers/items";

export const router = createTRPCRouter({
  items: itemsRouter,
});

export type AppRouter = typeof router;
