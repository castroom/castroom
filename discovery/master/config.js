const config = {
  region: "us-east-2",
  credentialsProfile: "discovery-master",
  queueUrl: "https://sqs.us-east-2.amazonaws.com/496139746510/discovery-task-queue",
  apiVersion: "2012-11-05",
  restoreCache: process.env.RESTORE_CACHE || false,
  seedUrl: "https://podcasts.apple.com/us/genre/podcasts-arts/id1301",
};

module.exports = config;
