import mongoose from "mongoose";
import { app } from "./app";
import { startCronJobs } from "./cron";
import dotenv from "dotenv-safe";
import * as strikeAccess from "./api/strikes";
import * as ogAccess from "./api/ogs";

console.log("Loading environment variables");
dotenv.config();

console.log("Connecting to database");
mongoose
  .connect("mongodb://fffapp:fffapp@mongo-db:27017/fffapp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(
    async () => {
      console.log("Populating DB");
      await Promise.all([ogAccess.retrieveOGs(), strikeAccess.retrieveStrikes()]);

      console.log("Starting job scheduler");
      startCronJobs();

      console.log("Start listening to requests on port 3000");
      app.listen(3000);

      console.log("Server up and running");
    },
    error => {
      console.log(error);
    }
  );
