import { Client } from "@elastic/elasticsearch";
import config from "../config";

export default class ElasticsearchService {
  constructor() {
    this.client = new Client({
      node: config.elasticSearchUrl,
      Connection: config.Connection,
      awsConfig: config.awsConfig,
    });
  }

  async addData(id, data) {
    console.log(`Adding ${id} to Elasticsearch`);
    await this.client.index({
      index: "podcasts",
      id,
      body: data,
    });
  }
}
