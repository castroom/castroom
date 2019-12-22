import axios from 'axios';

var urlFromQueue = "https://podcasts.apple.com/us/genre/podcasts-arts/id1301";

const getClickableUrls = (pageData) => {
  var clickableUrls = pageData.match(/https:\/\/podcasts.apple.com\/\w{2}\/((genre\/podcasts-.+?\/id\d{4}(\?letter=.(\&amp;page=\d\d?#page)?)?)|podcast\/(((\d+|\w+)\-){0,100}(\d+|\w+)\/id\d{0,12})(?="))/g);

  if (clickableUrls && clickableUrls.length >= 0) {
    // prevent the link back to this page from being processed again
    clickableUrls = clickableUrls.filter(item => item !== urlFromQueue)

    return Array.from(new Set(clickableUrls));
  }

  return [];
}

const getID = (url) => {
  var match = url.match(/\/id\d*/g)[0];

  if (match.length > 8) {
    match = match.replace("/id", "");
    return match;
  }
  return null;
}


axios.get(urlFromQueue).then(response => {
  // find all the outgoing urls
  const outgoingUrls = getClickableUrls(response.data)
  console.log(outgoingUrls)

  outgoingUrls.forEach(url => {
    // TODO: add this url to the queue - could also do a batch update
    console.log("Adding", url, "to the queue");
  });

  var id = getID(urlFromQueue);
  if (id !== null) {
    // TODO: lookup the new item 
    console.log("Lookup", urlFromQueue);
  }

  

  // if this points to a podcast url -> look up the metadata and save it to ES
  
}).catch(error => {
  // save the message back in the queue so that we can go over it at some point
  // set the tried count to 1 -> if this count is 2 then just discard the item since 
  // this link is broken
  console.log(error);
})