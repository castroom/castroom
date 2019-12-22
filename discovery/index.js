import axios from 'axios';
import iTunesProvider from "./providers/iTunes";

var url = "https://podcasts.apple.com/us/genre/podcasts-arts/id1301";

var provider = new iTunesProvider();

axios.get(url).then(response => {
  const crawlableUrls = provider.getCrawlableUrls(response.data, url);
  console.log(crawlableUrls)

  crawlableUrls.forEach(url => {
    // TODO: add this url to the queue - could also do a batch update
    console.log("Adding", url, "to the queue");
  });

  var id = provider.getPodcastId(url);
  if (id !== null) {
    var metadata = provider.lookup(id)
    console.log(metadata);
    // TODO: save it to ElasticSearch here
  }
  
}).catch(error => {
  // save the message back in the queue so that we can go over it at some point
  // set the tried count to 1 -> if this count is 2 then just discard the item since 
  // this link is broken
  console.log(error);
})