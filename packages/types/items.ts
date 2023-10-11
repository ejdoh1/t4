import { z } from "zod";

export const createItemRequestSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1).max(255),
});

export type CreateItemRequest = z.infer<typeof createItemRequestSchema>;

export const itemSchema = createItemRequestSchema.extend({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  sub: z.string(),
});

export type Item = z.infer<typeof itemSchema>;

export const itemsSchema = z.array(itemSchema);

export type Items = z.infer<typeof itemsSchema>;
