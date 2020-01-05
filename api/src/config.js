import AWS from "aws-sdk";
import { AmazonConnection } from "aws-elasticsearch-connector";

const config = {
  awsConfig: new AWS.Config({
    credentials: new AWS.Credentials(
      process.env.AWS_DISCOVERY_CRAWLER_ACCESS_KEY_ID,
      process.env.AWS_DISCOVERY_CRAWLER_SECRET_ACCESS_KEY,
    ),
    region: "us-east-2",
  }),
  elasticSearchUrl: "https://search-castroom-evemryzsuzqga6r6i5muonzf3e.us-east-2.es.amazonaws.com",
  Connection: AmazonConnection,
};

module.exports = config;
