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
        item: createItemRequestSchema,
        sub: z.string(),
      })
    )
    .returns(z.promise(itemSchema))
    .implement(async (args) => {
      const cp = itemSchema.parse({
        ...args.item,
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
