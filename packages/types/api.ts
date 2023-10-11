import { z } from "zod";

export const scopesSchema = z.nativeEnum({
  writeItems: "items:write",
  readItems: "items:read",
});
