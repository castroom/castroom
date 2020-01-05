import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";

const corsOptions = {
  origin: "https://castroom.co",
};

const app = express();
app.use(bodyParser.json());
app.use(helmet()); // sets security related HTTP response headers

app.get("/", cors(corsOptions), (req, res) => {
  res.send({ test: "testing" });
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});
