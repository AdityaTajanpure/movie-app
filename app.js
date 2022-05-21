const express = require("express");
require("dotenv").config();
const MongoConnection = require("./config/db");

const port = process.env.PORT;
const app = express();
app.use(express.json());

MongoConnection.connect();

app.listen(port, () => {
  console.log("listening on port " + port);
});

app.use("/movies", require("./routes/movie_routes"));
