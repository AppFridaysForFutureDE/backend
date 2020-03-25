import express, { Request, Response } from "express";
import FCMAdmin from "./fcm"
import StrikeAccess from "./strikeaccess"
import { json } from "body-parser";
import strikeRoutes from "./routes/strikes";
import mongoose from "mongoose";
import Ddos from "ddos";
var CronJob = require('cron').CronJob;
let mongoUp = true;

//------Firebase Admin------
const messageAdmin = new FCMAdmin("../de-fridaysforfuture-app-firebase-adminsdk-98yw1-c45342f3dc.json");


//------DDoS-Protection------
const ddos = new Ddos({ burst: 10, limit: 15 });//probably need to adjust these


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


//------Strike Access Cronjobs------
const strikeA = new StrikeAccess();
//retrieving strikes every day at 0
var job = new CronJob("0 0 * * *", function() {
  console.log("Retrieving Strikes");
  strikeA.retrieveStrikes();
}, null, true, "Europe/Berlin");
job.start();
//check strikes every hour from 8-20
var job = new CronJob("0 8-20 * * *", function() {
  console.log("Checking Strikes");
  strikeA.checkStrikes();
}, null, true, "Europe/Berlin");
job.start();


//------Express Server------
//create server, add json encoding and ddos protection
const app = express();
app.use(json());

//initialise routers; every router needs to use ddos
strikeRoutes.use(ddos.express);
app.use("/strikes", strikeRoutes);


app.use((err: Error, req: Request, res: Response) => {
  res.status(500).json({ message: err.message });
});

//only start server when mongo is up
if (mongoUp) {
  app.listen(3000);
}
