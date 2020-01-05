import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";

const app = express();
app.use(bodyParser.json());
app.use(helmet()); // sets security related HTTP response headers

app.get("/", (req, res) => {
  res.send({ test: "testing" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});
