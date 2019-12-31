// import { Client } from "@elastic/elasticsearch";
const { Client } = require("@elastic/elasticsearch");
// import config from "../config";
const config = require("../config");

export default class ElasticsearchService {
  constructor() {
    this.client = new Client(config.esClientConfig);
  }

  async addData(id, data) {
    console.log("Adding\n", id, data);
    await this.client.index({
      index: "podcasts",
      id,
      body: data,
    });
  }
}
