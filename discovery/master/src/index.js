import express from "express";
import levelup from "levelup";
import leveldown from "leveldown";
import bodyParser from "body-parser";
import QueueService from "./QueueService";
import config from "./config";

const app = express();
app.use(bodyParser.json());

const queue = new QueueService();

const cache = levelup(leveldown("./cache"));
if (!config.restoreCache) {
  cache.clear();
  // TODO: clear out the queue here too
  cache.put(config.seedUrl, "").then(() => queue.batchPush([config.seedUrl]))
    .then((response) => {
      console.log(response);
      console.log("Inserted Seed URL");
    }).catch((err) => {
      console.log("Error", err);
    });
}

function getPodcastId(url) {
  let id = url.match(/\/id\d*/g);

  if (id && id[0].length > 8) {
    id = id[0].replace("/id", "");
    return id;
  }
  return null;
}

function filterNewUrls(urls) {
  // return urls that don't exist in the cache
  const promises = [];

  for (let i = 0; i < urls.length; i += 1) {
    const url = urls[i];
    const id = getPodcastId(url) || url;

    const p = new Promise((resolve) => {
      cache.get(id, (gerr) => {
        if (gerr) {
          // doesn't exist in cache - add it
          cache.put(id, "").then(() => {
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
    queue.batchPush(newUrls).then((response) => {
      console.log("Pushed to queue:", newUrls);
      console.log("Response:", response, "\n");
    }).catch((err) => {
      console.log("Push Error", err);
    });
  });
});

// Start the server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});
