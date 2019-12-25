// import AWS from "aws-sdk";
var AWS = require('aws-sdk');

var config = {
  region: "us-east-2",
  credentialsProfile: "discovery-master",
  queueUrl: "https://sqs.us-east-2.amazonaws.com/496139746510/discovery-task-queue",
  apiVersion: "2012-11-05"
}

class SQSManager {
  constructor(config) {
    this.config = config;
    this.queueUrl = config.queueUrl;

    AWS.config.update({region: config.region});
    AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: config.credentialsProfile});

    this.sqs = new AWS.SQS({apiVersion: config.apiVersion});
  }

  sendMessage(message) {
    var params = {
      MessageBody: message,
      QueueUrl: this.queueUrl
    }

    return this.sqs.sendMessage(params).promise();
  }

  receiveMessage() {
    var params = {
      MaxNumberOfMessages: 1,
      QueueUrl: this.queueUrl,
      // how long it will wait to gather the messages
      // sometimes responses are empty so a higher number will prevent empty responses -> lower cost but slower reading
      WaitTimeSeconds: 1
    }

    return this.sqs.receiveMessage(params).promise();
  }

  deleteMessage(receiptHandle) {
    var params  = {
      QueueUrl: this.queueUrl,
      ReceiptHandle: receiptHandle
    };

    return this.sqs.deleteMessage(params).promise();
  }
}

var queue = new SQSManager(config);

// // Send Message
// queue.sendMessage("Testing Message").then(data => {
//   console.log("Pushed to Queue:", data.MessageId);
// }).catch(err => {
//   console.log("Error", err);
// })

// // Receive Message
// queue.receiveMessage().then(data => {
//   if (data.Messages) {
//     console.log(data.Messages);
//     var message = data.Messages[0].Body;
//     console.log("Message Received", message);
//   } else {
//     console.log("No Messages");
//   }
// }).catch(err => {
//   console.log("Receive Error", err);
// })

// // Delete
// var receiptHandle = "AQEB7Caq/AWSfkvCrevPZnNcZMWDaCRLevCTnhcswZ4Nz30UZ9arZ4VlVZHGh9cLlkcMXcw45iKENn3fpzBXkHy+0WK07dFpYHjPf9FHwjkKd9/bcYpK4l/niekfuOJitWF6ZadhJsRtvbUIhKSK8ITwItS6E8DkvOe9tqzNn8zGdJVvOKOwnN38ak9ULqpBBgz7TyLikjw6mDl1cmuC7Tx4CAhYi/d2nH3vKD+DrdQGq1iYshFmg6FG3Wf7PMSjSQAadRWXn0coRk0nKrmv3kgAGpvrB3mrTlOMkG9xJZfcdqqrdy/FLIVOW7SkgxS/0DRAbGYw7wHWS6qfEgoaGr3Ck+4LSiCgaAyGFMKZun+z3HV0HUQOrVZ2rxAbE0KRLOeGAw2/g3I3OSjywG6iFuEfQQ=="
// queue.deleteMessage(receiptHandle).then(data => {
//   console.log("Deleted", data);
// }).catch(err => {
//   console.log("Delete Error", err);
// })

