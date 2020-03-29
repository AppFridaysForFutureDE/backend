import { Strike } from "./models/strikes";
import * as util from "./utility";
import * as api from "./auth/apis";
import { messageAdmin } from "./app";
const day = 86401;
export default class StrikeAccess {

  //retrieves Strikes from website api and saves them to mongodb
  //should be executed once per day
  public async retrieveStrikes() {
    //fetch strike json
    const fetch = require("node-fetch");
    const response = await fetch(api.urlStrikes);
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
      for (i = 0; i < strikes.length; i++) {
        messageAdmin.sendMessage("og_"+strikes[i]["ogId"],strikes[i]["ogId"],"Streikalarm in " + strikes[i]["name"]+"!", "Demnächst findet hier ein Streik statt: "+strikes[i]["startingPoint"]+", " +strikes[i]["name"]);
        Strike.updateOne({ ogId: strikes[i]["ogId"] }, { notificationSent: true });
      }
    });
  }
}
