import axios from 'axios';

var seedURL = "https://podcasts.apple.com/ca/genre/podcasts-arts/id1301";

axios.get(seedURL).then(response => {
  // find all the outgoing urls
  console.log(response);
  // if this points to a podcast url -> look up the metadata and save it to ES
  
}).catch(error => {
  // save the message back in the queue so that we can go over it at some point
  // set the tried count to 1 -> if this count is 2 then just discard the item since 
  // this link is broken
})