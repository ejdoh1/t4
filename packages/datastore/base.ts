import { Config } from "sst/node/config";
import { DynamoDB } from "@aws-sdk/client-dynamodb";

class DataStoreBase {
  client: DynamoDB;
  tableName: string;

  constructor(tableName: string) {
    this.client = new DynamoDB({
      region: Config.REGION,
    });
    this.tableName = tableName;
  }
}

export { DataStoreBase };
