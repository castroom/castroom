// import AWS from "aws-sdk";
var AWS = require('aws-sdk');

AWS.config.update({region: 'us-east-2'});

var credentials = new AWS.SharedIniFileCredentials({profile: 'discovery-master'});
AWS.config.credentials = credentials;

var queueUrl = "https://sqs.us-east-2.amazonaws.com/496139746510/discovery-task-queue";


console.log(1);
var sqs = new AWS.SQS({apiVersion: "2012-11-05"});
console.log(2);
// var params = {
//   MessageBody: "www.maharsh.net/test",
//   QueueUrl: queueUrl
// }

var params = {
  MaxNumberOfMessages: 1,
  QueueUrl: queueUrl,
  WaitTimeSeconds: 0
}

console.log(3);

sqs.receiveMessage(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else if (data.Messages) {
    var url = data.Messages[0].Body;
    console.log(url);
    // var deleteParams = {
    //   QueueUrl: queueUrl,
    //   ReceiptHandle: data.Messages[0].ReceiptHandle
    // };

    // sqs.deleteMessage(deleteParams, function(err, data) {
    //   if (err) {
    //     console.log("Delete Error", err);
    //   } else {
    //     console.log("Message Deleted", data);
    //   }
    // })
  }
})
// sqs.sendMessage(params, function(err, data) {
//   console.log(4);
//   if (err) {
//     console.log("Error", err);
//   } else {
//     console.log("Success", data.MessageId);
//   }
// });