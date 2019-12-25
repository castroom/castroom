import axios from "axios";
import getProvider from "./providers/ProviderSelectionUtil";
import QueueService from "./services/QueueService";

const urlFromQueue = "https://podcasts.apple.com/us/podcast/naked-on-cashmere/id1476868752";

const provider = getProvider(urlFromQueue);
const queue = new QueueService();

axios.get(urlFromQueue).then((response) => {
  const crawlableUrls = provider.getCrawlableUrls(response.data, urlFromQueue);
  console.log(crawlableUrls);

  // add all outgoing urls to the buffer
  crawlableUrls.forEach((url) => {
    queue.push(url);
  });
  // push the outgoing links from buffer to SQS
  queue.send();

  const id = provider.getPodcastId(urlFromQueue);
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
