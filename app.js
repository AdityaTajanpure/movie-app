const express = require("express");
require("dotenv").config();
const MongoConnection = require("./config/db");
const cors = require("cors");

const port = process.env.PORT;
const app = express();
app.use(express.json());

var allowedDomains = [
  "https://guvi-movie-app.netlify.app",
  "http://localhost:3000",
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedDomains.indexOf(origin) === -1) {
        var msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

MongoConnection.connect();

app.listen(port, () => {
  console.log("listening on port " + port);
});

app.use("/movies", require("./routes/movie_routes"));
