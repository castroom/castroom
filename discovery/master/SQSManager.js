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

    this.sqs.sendMessage(params, function(err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Pushed to Queue:", data.MessageId);
      }
    });
  }
}

var queue = new SQSManager(config);
queue.sendMessage("google.com");

// // console.log(1);
// // var sqs = new AWS.SQS({apiVersion: "2012-11-05"});
// // console.log(2);

// var params = {
//   MaxNumberOfMessages: 1,
//   QueueUrl: config.queueUrl,
//   WaitTimeSeconds: 0
// }

// console.log(3);

// sqs.receiveMessage(params, function(err, data) {
//   if (err) {
//     console.log("Error", err);
//   } else if (data.Messages) {
//     var url = data.Messages[0].Body;
//     console.log(url);
//     // var deleteParams = {
//     //   QueueUrl: config.queueUrl,
//     //   ReceiptHandle: data.Messages[0].ReceiptHandle
//     // };

//     // sqs.deleteMessage(deleteParams, function(err, data) {
//     //   if (err) {
//     //     console.log("Delete Error", err);
//     //   } else {
//     //     console.log("Message Deleted", data);
//     //   }
//     // })
//   }
// })
