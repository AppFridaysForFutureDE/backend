import express, { Request, Response } from "express";
import FCMAdmin from "./fcm";
import StrikeAccess from "./strikes";
import OgAccess from "./ogs";
import { json } from "body-parser";
import strikeRoutes from "./routes/strikes";
import ogRoutes from "./routes/ogs";
import webhookRoutes from "./routes/webhook";
import mongoose from "mongoose";
import Ddos from "ddos";
const CronJob = require("cron").CronJob;
let mongoUp = true;

//------FCM------
export const messageAdmin = new FCMAdmin("../src/auth/de-fridaysforfuture-app-firebase-adminsdk-98yw1-c45342f3dc.json");

//------DoS-Protection------
const DoSProtection = new Ddos({ burst: 10, limit: 15 }); //probably need to adjust these

//------MongoDB------
//connect to Mongo daemon
mongoose
  .connect("mongodb://fffapp:fffapp@mongo-db:27017/fffapp", {
    useNewUrlParser: true
  })
  .then(() => console.log("MongoDB Connected"))
  .catch(function(err) {
    console.log(err);
    mongoUp = false; //cant use close() here because server isnt already listening
    console.log(
      "Server not started because of a critical error that occurred when starting MongoDB"
    );
  });

//------Cronjobs------
const strikeA = new StrikeAccess();
console.log("Retrieving Strikes");
strikeA.retrieveStrikes();
const ogA = new OgAccess();
console.log("Retrieving Ogs");
ogA.retrieveOgs();

//retrieving strikes every day at 0:00
const strikeJob = new CronJob(
  "0 0 * * *",
  function() {
    console.log("Retrieving Strikes");
    strikeA.retrieveStrikes();
  },
  null,
  true,
  "Europe/Berlin"
);
strikeJob.start();

//retrieving ogs at 0:05 on mondays, wednesdays and fridays
const ogJob = new CronJob(
  "5 0 * * 1,3,5",
  function() {
    console.log("Retrieving Ogs");
    ogA.retrieveOgs();
  },
  null,
  true,
  "Europe/Berlin"
);
ogJob.start();

//check strikes every hour from 8-20
const strikeNotifyJob = new CronJob(
  "0 8-22 * * *",
  function() {
    console.log("Checking Strikes");
    strikeA.checkStrikes();
  },
  null,
  true,
  "Europe/Berlin"
);
strikeNotifyJob.start();

//------Express Server------
//create server, add json encoding and ddos protection
const app = express();
app.use(json());

//initialise routers; every router needs to use ddos
strikeRoutes.use(DoSProtection.express);
ogRoutes.use(DoSProtection.express);
app.use("/api/v1/strikes", strikeRoutes);
app.use("/api/v1/ogs", ogRoutes);
app.use("/internal/webhooks/ghost", webhookRoutes);

app.use(function(err: Error, req: Request, res: Response, next) {
  res.status(500).json({ message: err.message });
});

//only start server when mongo is up
if (mongoUp) {
  app.listen(3000);
}
