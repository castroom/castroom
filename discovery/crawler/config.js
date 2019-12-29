const config = {
  region: "us-east-2",
  credentialsProfile: "discovery-master",
  queueUrl: "https://sqs.us-east-2.amazonaws.com/496139746510/discovery-task-queue",
  apiVersion: "2012-11-05",
  numTriesPolling: 3,
  cacheServicePushUrl: "http://127.0.0.1:8080/push",
};

module.exports = config;