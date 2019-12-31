import axios from "axios";
import config from "./config";
import getProvider from "./providers/ProviderSelectionUtil";
import QueueService from "./services/QueueService";
import ElasticsearchService from "./services/ElasticsearchService";

const queue = new QueueService();
const es = new ElasticsearchService();

// when this value is 0, stop all polling since the queue is empty
let pollTriesRemaining = config.numTriesPolling;

function messageHandler(url) {
  console.log("Crawling", url);
  const provider = getProvider(url);

  axios.get(url).then((response) => {
    const crawlableUrls = provider.getCrawlableUrls(response.data, url);
    console.log(crawlableUrls);

    queue.batchPush(crawlableUrls).catch((error) => {
      // might want to stop crawling here in the future
      console.log("Error:", error);
    });

    const id = provider.getPodcastId(url);
    const isPodcastLink = id !== null; // as opposed to a page#, category link
    if (isPodcastLink) {
      provider.getMetadata(id).then((metadata) => {
        if (metadata.data && metadata.data.results) {
          const result = metadata.data.results[0];
          console.log(result);
          // TODO: only save the fields from the config file
          es.addData(result.trackId, result);
        }
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
    console.log("Crawl Error:", error);
  });

  // if there was an error previously, this value would have been decremented
  // we want to reset this to measure consecutive errors
  pollTriesRemaining = config.numTriesPolling;
}

function errorHandler(err) {
  console.log("Error", err.message);
}

function processingErrorHandler(err) {
  console.log("Processing Error", err.message);
}

function timeoutHandler(err) {
  console.log("Timeout", err.message);
}

function emptyQueueHandler() {
  console.log("Empty");

  pollTriesRemaining -= 1;
  if (pollTriesRemaining === 0) {
    queue.stopPolling();
  }
}

queue.startPolling(
  messageHandler,
  errorHandler,
  processingErrorHandler,
  timeoutHandler,
  emptyQueueHandler,
);
