import { z } from "zod";

export const createAppRequestSchema = z.object({
  name: z.string().min(1).max(255),
});

export type CreateAppRequest = z.infer<typeof createAppRequestSchema>;

export const appSchema = createAppRequestSchema.extend({
  id: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
  sub: z.string(),
});

export type App = z.infer<typeof appSchema>;

export const appsSchema = z.array(appSchema);

export type Apps = z.infer<typeof appsSchema>;
