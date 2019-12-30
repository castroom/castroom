import AWS from "aws-sdk";
import config from "./config";

export default class QueueService {
  constructor() {
    this.queueUrl = config.queueUrl;

    AWS.config.update({ region: config.region });
    AWS.config.credentials = new AWS.SharedIniFileCredentials({
      profile: config.credentialsProfile,
    });

    this.sqs = new AWS.SQS({ apiVersion: config.apiVersion });
  }

  batchPush(messages) {
    const entries = [];
    for (let i = 0; i < messages.length; i += 1) {
      entries.push({
        Id: i.toString(), // only needs to be unique per request
        MessageBody: messages[i],
      });
    }

    // send the items in batches of 10 (limit of the SQS API)
    const promises = [];
    while (entries.length) {
      const batch = entries.splice(0, 10);
      const params = {
        Entries: batch,
        QueueUrl: this.queueUrl,
      };
      promises.push(this.sqs.sendMessageBatch(params).promise());
    }

    return Promise.all(promises);
  }
}
