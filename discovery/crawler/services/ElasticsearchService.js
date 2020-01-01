import { Client } from "@elastic/elasticsearch";
import config from "../config";

export default class ElasticsearchService {
  constructor() {
    this.client = new Client(config.esClientConfig);
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
