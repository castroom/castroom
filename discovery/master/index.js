import express from "express";
import levelup from "levelup";
import leveldown from "leveldown";
import bodyParser from "body-parser";
import QueueService from "./QueueService";

const cache = levelup(leveldown("./cache"));
cache.clear();

const app = express();
app.use(bodyParser.json());

const queue = new QueueService();

function filterNewUrls(urls) {
  // find the urls that haven't been seen before
  const promises = [];
  /* eslint-disable no-await-in-loop */
  for (let i = 0; i < urls.length; i += 1) {
    const url = urls[i];
    const p = new Promise((resolve) => {
      cache.get(url, (gerr) => {
        if (gerr) {
          // doesn't exist in cache - add it
          cache.put(url, "").then(() => {
            resolve(url);
          });
        } else {
          // url already exists in cache
          resolve();
        }
      });
    });
    promises.push(p);
  }

  return Promise.all(promises).then((responses) => {
    // remove the undefined responses from the cache hit
    const newUrls = responses.filter((url) => url !== undefined);
    return newUrls;
  });
}

app.post("/push", (req, res) => {
  const { urls } = req.body;

  // end the connection immediately since we have nothing to send back to the workers
  res.status(200).send();

  filterNewUrls(urls).then((newUrls) => {
    // add all the new urls to the queue for crawling
    console.log("New Urls", newUrls);
    // queue.batchPush(newUrls).then((response) => {
    //   console.log("Pushed to queue:", newUrls);
    //   console.log("Response:", response);
    // }).catch((err) => {
    //   console.log("Push Error", err);
    // });
  });
});

// Start the server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});
