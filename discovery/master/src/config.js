import AWS from "aws-sdk";

const config = {
  region: "us-east-2",
  queueUrl: "",
  apiVersion: "2012-11-05",
  restoreCache: process.env.RESTORE_CACHE || false,
  seedUrl: "https://podcasts.apple.com/us/genre/podcasts-arts/id1301",
  awsConfig: new AWS.Config({
    credentials: new AWS.Credentials(
      process.env.AWS_DISCOVERY_MASTER_ACCESS_KEY_ID,
      process.env.AWS_DISCOVERY_MASTER_SECRET_ACCESS_KEY,
    ),
    region: "us-east-2",
  }),
};

module.exports = config;
