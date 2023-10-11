import { Config } from "sst/node/config";
import { z } from "zod";
import { unmarshall, marshall } from "@aws-sdk/util-dynamodb";
import { appSchema, appsSchema, createAppRequestSchema, App } from "@t4/types";
import { DataStoreBase } from "./base";

class AppsDataStore extends DataStoreBase {
  constructor() {
    super(Config.APPS_TABLE_NAME);
  }

  get = z
    .function()
    .describe("Get app")
    .args(
      z.object({
        id: z.string(),
        sub: z.string(),
      })
    )
    .returns(z.promise(appSchema))
    .implement(async (args) => {
      const result = await this.client.getItem({
        TableName: this.tableName,
        Key: {
          id: { S: args.id },
          sub: { S: args.sub },
        },
      });

      if (!result.Item) throw new Error("App not found");

      return appSchema.parse(unmarshall(result.Item));
    });

  update = z
    .function()
    .describe("Update app")
    .args(
      z.object({
        request: createAppRequestSchema,
        id: z.string(),
        sub: z.string(),
      })
    )
    .returns(z.promise(appSchema))
    .implement(async (args) => {
      const app = await this.get({ id: args.id, sub: args.sub });

      const cp = appSchema.parse({
        ...app,
        ...args.request,
        updatedAt: Date.now(),
      } satisfies App);

      await this.client.putItem({
        TableName: this.tableName,
        Item: marshall(cp),
      });

      return cp;
    });

  list = z
    .function()
    .describe("Get apps by sub")
    .args(z.object({ sub: z.string() }))
    .returns(z.promise(appsSchema))
    .implement(async (args) => {
      const result = await this.client.query({
        TableName: this.tableName,
        KeyConditionExpression: "#sub = :sub",
        ExpressionAttributeValues: {
          ":sub": { S: args.sub },
        },
        ExpressionAttributeNames: {
          "#sub": "sub",
        },
      });

      if (!result.Items) return [];

      return result.Items.map((app) => appSchema.parse(unmarshall(app)));
    });

  create = z
    .function()
    .describe("Create app")
    .args(
      z.object({
        request: createAppRequestSchema,
        sub: z.string(),
        id: z.string(),
      })
    )
    .returns(z.promise(appSchema))
    .implement(async (args) => {
      const cp = appSchema.parse({
        ...args.request,
        id: args.id,
        sub: args.sub,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      } satisfies App);

      const app = marshall(cp);

      await this.client.putItem({
        TableName: this.tableName,
        Item: app,
      });

      return cp;
    });

  delete = z
    .function()
    .describe("Delete cart product")
    .args(
      z.object({
        id: z.string(),
        sub: z.string(),
      })
    )
    .returns(z.promise(z.void()))
    .implement(async (args) => {
      await this.client.deleteItem({
        TableName: this.tableName,
        Key: {
          id: { S: args.id },
          sub: { S: args.sub },
        },
      });
    });
}

export { AppsDataStore };
