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
  elasticSearchUrl: "",
  Connection: AmazonConnection,
};

module.exports = config;
