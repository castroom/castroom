import axios from "axios";
import AWS from "aws-sdk";
const { Consumer } = require('sqs-consumer');
import getProvider from "./providers/ProviderSelectionUtil";
import QueueService from "./services/QueueService";
import config from "./config";

// const urlFromQueue = "https://podcasts.apple.com/us/podcast/naked-on-cashmere/id1476868752";


const queue = new QueueService();
let triesRemaining = 2;

AWS.config.update({ region: config.region });
AWS.config.credentials = new AWS.SharedIniFileCredentials({
  profile: config.credentialsProfile,
});


function crawlUrl(url) {
  console.log(url);
  const provider = getProvider(url);

  axios.get(url).then((response) => {
    const crawlableUrls = provider.getCrawlableUrls(response.data, url);
    console.log(crawlableUrls);

    // add all outgoing urls to the buffer
    crawlableUrls.forEach((crawlableUrl) => {
      queue.push(crawlableUrl);
    });
    // push the outgoing links from buffer to SQS
    queue.send().catch((error) => {
      // MIGHT WANT TO HANDLE THIS OUTSIDE BY STOPPING THE CRAWLING
      console.log("Error:", error);
    });

    const id = provider.getPodcastId(url);
    const isPodcastLink = id !== null; // as opposed to a page#, category link
    if (isPodcastLink) {
      provider.getMetadata(id).then((metadata) => {
        console.log(metadata.data);
        // TODO: save it to ElasticSearch here
      }).catch((error) => {
        console.log("Error in lookup", error);
        // add this URL back to the queue and start new server - shut this one down
        // could just wait 5 seconds for every request to make sure this never gets rate limited
      });
    }
  }).catch((error) => {
    // save the message back in the queue so that we can go over it at some point
    // set the tried count to 1 -> if this count is 2 then just discard the item since
    // this link is broken
    console.log(error);
  });
}

// crawlUrl("https://podcasts.apple.com/us/podcast/naked-on-cashmere/id1476868752");

const app = Consumer.create({
  queueUrl: config.queueUrl,
  handleMessage: async (message) => crawlUrl(message.Body),
  sqs: new AWS.SQS(),
  // rate limit is 20/minute - so pause for 3 seconds between each URL
  // split this between waiting and repolling frequency
  pollingWaitTimeMs: 2000,
  waitTimeSeconds: 1,
});

app.on("error", (err) => {
  console.log("Error", err.message);
});

app.on("processing_error", (err) => {
  console.log("Processing Error", err.message);
});

app.on("timeout_error", (err) => {
  console.error(err.message);
});

app.on("empty", () => {
  console.log("Empty");
  triesRemaining -= 1;

  if (triesRemaining === 0) {
    // stop polling to prevent a high cost
    // should only get here if the queue is empty and we failed to shut off the server
    app.stop();
  }
});

app.start();
