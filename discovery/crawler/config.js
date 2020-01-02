import AWS from "aws-sdk";
import { AmazonConnection } from "aws-elasticsearch-connector";

const config = {
  queueUrl: "https://sqs.us-east-2.amazonaws.com/496139746510/discovery-task-queue",
  apiVersion: "2012-11-05",
  numTriesPolling: 3,
  cacheServiceUrl: process.env.MASTER_NODE_URL || "http://127.0.0.1:8080",
  awsConfig: new AWS.Config({
    credentials: new AWS.Credentials(
      process.env.AWS_DISCOVERY_CRAWLER_ACCESS_KEY_ID,
      process.env.AWS_DISCOVERY_CRAWLER_SECRET_ACCESS_KEY,
    ),
    region: "us-east-2",
  }),
  elasticSearchUrl: process.env.ELASTICSEARCH_URL || "http://localhost:9200",
  Connection: AmazonConnection,
  // all the fields from the lookup result that we want to store in elasticsearch
  fieldsToStore: ["artistName", "trackName", "trackCensoredName", "artistViewUrl", "trackViewUrl", "feedUrl", "artworkUrl100", "artworkUrl600", "country", "primaryGenreName", "trackExplicitness", "releaseDate", "genres", "trackCount"],
};

module.exports = config;
