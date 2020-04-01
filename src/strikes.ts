import { Strike } from "./models/strikes";
import * as util from "./utility";
import { messageAdmin } from "./app";
import nodeFetch from "node-fetch";

const day = 86401;

export default class StrikeAccess {
  //retrieves Strikes from website api and saves them to mongodb
  //should be executed once per day
  public async retrieveStrikes() {
    // TODO: handle missing url?
    const url = process.env.STRIKE_URL || "";
    //fetch strike json
    const response = await nodeFetch(url);
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
      try {
        parsed = util.getDate(data[i][" Uhrzeit"]);
      } catch {
        continue;
      }
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
      strikes.forEach(strike => {
        messageAdmin.sendMessage(
          `og_${strike["ogId"]}`,
          strike["ogId"],
          `Streikalarm in ${strike["name"]}`,
          `Demnächst findet hier ein Streik statt: ${strike["startingPoint"]}, ${strike["name"]}`
        );
        Strike.updateOne({ ogId: strike["ogId"] }, { notificationSent: true });
      });
    });
  }
}
