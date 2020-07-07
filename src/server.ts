import mongoose from "mongoose";
import { app } from "./express/app";
import { startCronJobs } from "./cron";
import dotenv from "dotenv-safe";
import { User } from "./models/userModel";
import { UserManager } from "./userManager";

console.log("Loading environment variables");
dotenv.config({
  allowEmptyValues: true
});

console.log("Creating user from env");
if (process.env.FFF_USER && process.env.FFF_PW) {
  let pwSalt = UserManager.generateRandomString(16);
  let pwHash = UserManager.hashPassword(process.env.FFF_PW, pwSalt);
  User.findOneAndUpdate(
    { name: process.env.FFF_USER },
    {
      passwordHash: pwHash,
      salt: pwSalt
    },
    { upsert: true },
    function (err, doc) {
      if (err) {
        console.log("error while creating user from env");
        console.log(err);
      }
    }
  );
}


console.log("Connecting to database");
mongoose
  .connect("mongodb://fffapp:fffapp@mongo-db:27017/fffapp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(
    async () => {
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
