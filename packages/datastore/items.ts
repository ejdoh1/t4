import { Config } from "sst/node/config";
import { z } from "zod";
import { unmarshall, marshall } from "@aws-sdk/util-dynamodb";
import {
  itemSchema,
  itemsSchema,
  createItemRequestSchema,
  Item,
} from "@t4/types";
import { v4 as uuidv4 } from "uuid";
import { DataStoreBase } from "./base";

class ItemsDataStore extends DataStoreBase {
  constructor() {
    super(Config.ITEMS_TABLE_NAME);
  }

  get = z
    .function()
    .describe("Get item")
    .args(
      z.object({
        id: z.string().uuid(),
        sub: z.string(),
      })
    )
    .returns(z.promise(itemSchema))
    .implement(async (args) => {
      const result = await this.client.getItem({
        TableName: this.tableName,
        Key: {
          id: { S: args.id },
          sub: { S: args.sub },
        },
      });

      if (!result.Item) throw new Error("Item not found");

      return itemSchema.parse(unmarshall(result.Item));
    });

  update = z
    .function()
    .describe("Update item")
    .args(
      z.object({
        request: createItemRequestSchema,
        id: z.string().uuid(),
        sub: z.string(),
      })
    )
    .returns(z.promise(itemSchema))
    .implement(async (args) => {
      const item = await this.get({ id: args.id, sub: args.sub });

      const cp = itemSchema.parse({
        ...item,
        ...args.request,
        updatedAt: Date.now(),
      } satisfies Item);

      await this.client.putItem({
        TableName: this.tableName,
        Item: marshall(cp),
      });

      return cp;
    });

  list = z
    .function()
    .describe("Get cart products by sub")
    .args(z.object({ sub: z.string() }))
    .returns(z.promise(itemsSchema))
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

      return result.Items.map((item) => itemSchema.parse(unmarshall(item)));
    });

  create = z
    .function()
    .describe("Create item")
    .args(
      z.object({
        request: createItemRequestSchema,
        sub: z.string(),
      })
    )
    .returns(z.promise(itemSchema))
    .implement(async (args) => {
      const cp = itemSchema.parse({
        ...args.request,
        id: uuidv4(),
        sub: args.sub,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      } satisfies Item);

      const item = marshall(cp);

      await this.client.putItem({
        TableName: this.tableName,
        Item: item,
      });

      return cp;
    });

  delete = z
    .function()
    .describe("Delete cart product")
    .args(
      z.object({
        id: z.string().uuid(),
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

export { ItemsDataStore };
