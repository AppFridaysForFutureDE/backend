import express, { Request, Response } from "express";
import StrikeAccess from "./strikes";
import OGAccess from "./ogs";
import { json } from "body-parser";
import strikeRoutes from "./routes/strikes";
import ogRoutes from "./routes/ogs";
import webhookRoutes from "./routes/webhook";
import mongoose from "mongoose";
import expressStatusMonitor from "express-status-monitor";
import { app } from "./app";

const CronJob = require("cron").CronJob;
let mongoUp = true;

//------FCM------

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

  // then
  app.listen(3000);
  // then start cron jobs
}

//------Cronjobs------
const strikeA = new StrikeAccess();
console.log("Retrieving Strikes");
strikeA.retrieveStrikes();
const ogA = new OGAccess();
console.log("Retrieving OGs");
ogA.retrieveOGs();

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
    console.log("Retrieving OGs");
    ogA.retrieveOGs();
  },
  null,
  true,
  "Europe/Berlin"
);
ogJob.start();

//check strikes every hour from 8-20
const strikeNotifyJob = new CronJob(
  "0 8-20 * * *",
  function() {
    console.log("Checking Strikes");
    strikeA.checkStrikes();
  },
  null,
  true,
  "Europe/Berlin"
);
strikeNotifyJob.start();

