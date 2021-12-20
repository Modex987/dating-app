require("dotenv").config();
const mongoose = require("mongoose");

class DB {
      static mongo_uri = process.env.MONGO_URI;

      conn;

      connection;

      constructor() {
            this.track();
      }

      async connect() {
            this.conn = await mongoose.connect(DB.mongo_uri);
            this.connection = mongoose.connection;
      }

      track() {
            mongoose.connection.on("connected", () => {
                  console.log("\nConnected to mongoDB ...");
            });

            mongoose.connection.on("error", (err) => {
                  console.log(err.message);
            });

            mongoose.connection.on("disconnected", () => {
                  console.log("\nDisconnected from mongoDB ...");
            });

            process.on("SIGINT", async () => {
                  await mongoose.connection.close();
                  process.exit(0);
            });
      }
}

module.exports = DB;
