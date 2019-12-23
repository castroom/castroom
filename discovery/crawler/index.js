import axios from 'axios';
import getProvider from './providers/ProviderSelectionUtil';
import QueueService from "./services/QueueService";

var url = "https://podcasts.apple.com/us/podcast/naked-on-cashmere/id1476868752";

var provider = getProvider(url);
var queue = new QueueService();

axios.get(url).then(response => {
  const crawlableUrls = provider.getCrawlableUrls(response.data, url);
  console.log(crawlableUrls)

  // add all outgoing urls to the buffer
  crawlableUrls.forEach(url => {
    queue.push(url);
  });

  var id = provider.getPodcastId(url);
  var isPodcastLink = id !== null;    // as opposed to a page#, category link
  if (isPodcastLink) {
    provider.getMetadata(id).then(metadata => {
      console.log(metadata.data);
      // TODO: save it to ElasticSearch here
    }).catch(error => {
      console.log("Error in lookup");
      // add this URL back to the queue and start new server - shut this one down
      // could just wait 5 seconds for every request to make sure this never gets rate limited
    })
  }

  // push the outgoing links from buffer to SQS
  queue.send();
  
}).catch(error => {
  // save the message back in the queue so that we can go over it at some point
  // set the tried count to 1 -> if this count is 2 then just discard the item since 
  // this link is broken
  console.log(error);
})