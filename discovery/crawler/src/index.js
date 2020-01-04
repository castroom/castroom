import axios from "axios";
import config from "./config";
import getProvider from "./providers/ProviderSelectionUtil";
import QueueService from "./services/QueueService";
import ElasticsearchService from "./services/ElasticsearchService";

const queue = new QueueService();
const es = new ElasticsearchService();

// when this value is 0, stop all polling since the queue is empty
let pollTriesRemaining = config.numTriesPolling;

function pick(data, keys) {
  // returns the same object with only the keys provided in the keys variable
  const result = {};
  keys.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      result[key] = data[key];
    }
  });

  return result;
}

async function messageHandler(url) {
  // all errors in this function will get passed to the processingErrorHandler by sqs-consumer
  // and the message being processed won't get deleted if an error is encountered.
  console.log("Crawling", url);
  const provider = getProvider(url);

  const id = provider.getPodcastId(url);
  const isPodcastLink = id !== null; // as opposed to a page#, category link
  if (isPodcastLink) {
    // no need to crawl the contents of this link (we could in the future)
    const metadata = await provider.getMetadata(id);
    if (metadata.data && metadata.data.results) {
      // select and save a subset of the fields based on the config
      const result = metadata.data.results[0];
      // sometimes the result is empty - so in this case we just discard this URL since
      // we have no way of getting the metadata for it without iTunes providing it
      // safe exit from this function will delete the url from the queue
      if (result) {
        const podcastId = result.trackId;
        const data = pick(result, config.fieldsToStore);
        await es.addData(podcastId, data);
      }
    }
  } else {
    // crawl this page
    await axios.get(url).then(async (response) => {
      const crawlableUrls = provider.getCrawlableUrls(response.data, url);
      console.log(`Adding ${crawlableUrls.length} podcasts to crawl queue`);

      await queue.batchPush(crawlableUrls);
    });
  }

  // if there was an empty queue previously, this value would have been decremented
  // we want to reset this to correctly measure "consecutive" empty queue tries
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
