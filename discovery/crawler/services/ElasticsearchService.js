// import { Client } from "@elastic/elasticsearch";
const { Client } = require("@elastic/elasticsearch");
// import config from "../config";
const config = require("../config");

class ElasticsearchService {
  constructor() {
    this.client = new Client(config.esClientConfig);
  }

  addData(id, data) {
    this.client.index({
      index: "podcasts",
      id,
      body: data,
    });
  }
}

var es = new ElasticsearchService();
var id = "another";
var data = {
  name: "Maharsh Patel",
  feedURL: "https://feeds.simplecast.com/pDG8rerg",
};
es.addData(id, data);