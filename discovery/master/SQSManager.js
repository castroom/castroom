// import AWS from "aws-sdk";
var AWS = require('aws-sdk');
var config = require("./config");
// import config from "./config";

class SQSManager {
  constructor() {
    this.queueUrl = config.queueUrl;

    AWS.config.update({ region: config.region });
    AWS.config.credentials = new AWS.SharedIniFileCredentials({
      profile: config.credentialsProfile,
    });

    this.sqs = new AWS.SQS({ apiVersion: config.apiVersion });
  }

  sendMessage(message) {
    // TODO: look into a batch send for SQS

    const params = {
      MessageBody: message,
      QueueUrl: this.queueUrl,
    };

    return this.sqs.sendMessage(params).promise();
  }
}

const queue = new SQSManager();


// // Send Message
queue.sendMessage("https://podcasts.apple.com/us/podcast/naked-on-cashmere/id1476868752").then((data) => {
  console.log("Pushed to Queue:", data.MessageId);
}).catch((err) => {
  console.log("Error", err);
});
