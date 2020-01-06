import { Client } from "@elastic/elasticsearch";
import AWS from "aws-sdk";
import config from "../config";

export default class ElasticsearchService {
  constructor() {
    AWS.config.update(config.awsConfig);
    this.client = new Client({
      node: config.elasticSearchUrl,
      Connection: config.Connection,
    });
  }

  search(field, value, resultCount) {
    return this.client.search({
      index: "podcasts",
      body: {
        query: {
          match: {
            trackName: value,
          },
        },
      },
      size: resultCount,
    }).then((response) => response.body.hits);
  }
}
