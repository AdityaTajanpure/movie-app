const express = require("express");
require("dotenv").config();
const MongoConnection = require("./config/db");
const cors = require("cors");

const port = process.env.PORT;
const app = express();
app.use(express.json());

app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
  next();
});
MongoConnection.connect();

app.listen(port, () => {
  console.log("listening on port " + port);
});

app.use("/movies", require("./routes/movie_routes"));
