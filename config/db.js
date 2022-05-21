const { MongoClient } = require("mongodb");

class MongoConnection {
  static async connect() {
    if (this.connection) return this.connection;
    this.connection = new MongoClient(process.env.MONGO_URI);
    this.connection
      .connect()
      .then((value) => {
        console.log("Connected to Mongo");
      })
      .catch((err) => {
        console.log(err);
      });
    return this.connection;
  }
}

module.exports = MongoConnection;
