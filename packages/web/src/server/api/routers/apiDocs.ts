import { Config } from "sst/node/config";
import { router as appRouterV0_0_1 } from "@t4/api/v0.0.1/root";
import { generateOpenApiDocument } from "trpc-openapi";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const apiVersions = z.enum(["0.0.1"]);

// Generate OpenAPI schema document
export const openApiDocumentV0_0_1 = generateOpenApiDocument(appRouterV0_0_1, {
  title: "Items API",
  description: "API for managing items",
  version: apiVersions.enum["0.0.1"],
  baseUrl: Config.API_ENDPOINT_URL + "/api/v0.0.1",
});

const router = createTRPCRouter({
  getDocs: publicProcedure
    .input(z.object({ version: apiVersions }))
    .query(() => {
      if (apiVersions.enum["0.0.1"]) return openApiDocumentV0_0_1;
      throw new Error("Invalid API version");
    }),
});

export default router;
