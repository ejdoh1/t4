import { Config } from "sst/constructs";
import { type Stack, Table } from "sst/constructs";
import { tableNames, paramNames } from "@t4/constants";

export const itemsStack = (stack: Stack) => {
  const table = new Table(stack, tableNames.enum.items, {
    fields: {
      sub: "string",
      id: "string",
    },
    primaryIndex: { partitionKey: "sub", sortKey: "id" },
  });

  const tableName = new Config.Parameter(
    stack,
    paramNames.enum.itemsTableName,
    {
      value: table.tableName,
    }
  );

  return {
    table,
    tableName,
  };
};
