import { Strike } from "./models/strikes";
import FCMAdmin from "./fcm";
import * as util from "./utility";
import * as api from "./auth/apis";
const day = 86401;
export default class StrikeAccess {
  private messageAdmin: FCMAdmin;

  constructor() {
    this.messageAdmin = new FCMAdmin(
      "../src/auth/de-fridaysforfuture-app-firebase-adminsdk-98yw1-c45342f3dc.json"
    );
  }
  //retrieves Strikes from website api and saves them to mongodb
  //should be executed once per day
  public async retrieveStrikes() {
    //fetch strike json
    const fetch = require("node-fetch");
    const response = await fetch(api.urlMapdata);
    let data = [];
    try {
      data = await response.json();
    } catch (error) {
      return;
    }

    //delete all strikes
    const res = await Strike.deleteMany({});
    console.log("Deleted " + res.deletedCount + " Strikes");

    //loop through strikes and save them
    let i: number;
    let parsed: Date;
    for (i = 0; i < data.length; i++) {
      try { parsed = util.getDate(data[i][" Uhrzeit"]); } catch { continue; }
      const newStrike = new Strike({
        ogId: util.hash(data[i][" Name"]),
        name: data[i][" Name"],
        date: util.toUnixTimestamp(parsed),
        startingPoint: data[i][" Startpunkt"],
        fbEvent: data[i][" Facebook event"],
        additionalInfo: data[i][" zusatzinfo"],
        notificationSent: false,
        retrievedAt: Date.now()
      });
      newStrike.save();
    }
  }

  //checks and notifies for strikes that fulfill these conditions:
  //-notificationSent is false
  //-strike is within 24 hours from now
  //should be executed every hour
  public checkStrikes(): void {
    const tomorrow: number = util.toUnixTimestamp(new Date()) + day;
    Strike.find({ notificationSent: false, date: { $lt: tomorrow } }, function(
      err: Error,
      strikes
    ) {
      if (err) return console.error(err);
      let i = 0;
      for (i = 0; i < strikes.length; i++) {}
    });
  }
}
