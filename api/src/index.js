import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import ElasticsearchService from "./services/ElasticsearchService";

const es = new ElasticsearchService();

const app = express();
app.use(bodyParser.json());
app.use(helmet()); // sets security related HTTP response headers

app.get("/", async (req, res) => {
  if (req && req.query.q) {
    es.search("trackName", req.query.q, 5).then((response) => {
      console.log(response);
      res.send(response);
    }).catch((err) => {
      console.log(err);
    });
  } else {
    res.sendStatus(200);
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});
