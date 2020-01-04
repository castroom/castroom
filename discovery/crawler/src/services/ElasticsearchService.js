const { Client } = require("@elastic/elasticsearch");
const config = require("../config");

class ElasticsearchService {
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

  search() {
    return this.client.search({
      index: "podcasts",
      q: "trackName:Wake Up Miami Morning Show",
      size: 1,
    });
  }
}

const es = new ElasticsearchService();
es.search().then((response) => console.log(response.body.hits.hits[0]));
