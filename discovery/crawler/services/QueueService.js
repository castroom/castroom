import axios from "axios";
import AWS from "aws-sdk";
import { Consumer } from "sqs-consumer";
import config from "../config";

export default class QueueService {
  constructor() {
    this.consumer = null;
    this.cacheServicePushUrl = config.cacheServicePushUrl;

    AWS.config.update({ region: config.region });
    AWS.config.credentials = new AWS.SharedIniFileCredentials({
      profile: config.credentialsProfile,
    });
  }

  startPolling(messageHandler, errorHandler, processingErrorHandler,
    timeoutHandler, emptyQueueHandler) {
    const consumer = Consumer.create({
      queueUrl: config.queueUrl,
      handleMessage: (message) => messageHandler(message.Body),
      sqs: new AWS.SQS(),
      // rate limit is 20/minute - so pause for 3 seconds between each URL
      // split this between waiting and repolling frequency
      pollingWaitTimeMs: 2000,
      waitTimeSeconds: 1,
    });

    consumer.on("error", errorHandler);
    consumer.on("processing_error", processingErrorHandler);
    consumer.on("processing_error", processingErrorHandler);
    consumer.on("timeout_error", timeoutHandler);
    consumer.on("empty", emptyQueueHandler);

    this.consumer = consumer;
    this.consumer.start();
  }

  stopPolling() {
    if (this.consumer) {
      this.consumer.stop();
    }
  }

  batchPush(messages) {
    // sends the buffered messages to the master node
    return axios.post(this.cacheServicePushUrl, {
      urls: messages,
    }).then((response) => {
      console.log("Response Code:", response.status);
    });
  }
}
