import express from "express";
import levelup from "levelup";
import leveldown from "leveldown";
import bodyParser from "body-parser";

const cache = levelup(leveldown("./cache"));
cache.clear();

const app = express();
app.use(bodyParser.json());

app.post("/push", (req, res) => {
  const { urls } = req.body;

  // end the connection immediately since we have nothing to send back to the workers
  res.status(200).send();

  urls.forEach((url) => {
    cache.get(url, (gerr) => {
      if (gerr) {
        // not found in cache - add it
        cache.put(url, "").then(() => {
          console.log(url, "was pushed");
        }).catch((perr) => {
          console.log("Error:", perr);
        });
      } else {
        // already exists in cache
        console.log(url, "already exists");
      }
    });
  });
});

// Start the server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});
