import { Strike } from "./models/strikes";
import * as util from "./utility";
import { FCMAdmin } from "./services/fcm";
import nodeFetch from "node-fetch";

const day = 86401;

export default class StrikeAccess {
  //retrieves Strikes from website api and saves them to mongodb
  //should be executed once per day
  public async retrieveStrikes(): Promise<void> {
    const response = await nodeFetch(`${process.env.WEBSITE_URL}/strike`);
    let data = [];
    try {
      data = await response.json();
    } catch (error) {
      return;
    }

    //get retrievedAt date/time
    const now = Date.now();

    //delete all strikes
    const res = await Strike.deleteMany({});
    console.log(`Deleted ${res.deletedCount} strikes`);
    console.log(`Retrieved ${data.length} strikes`);

    //loop through strikes
    data.forEach(strike => {
      //save strike
      const newStrike = new Strike({
        ogId: util.hash(strike["localGroupName"]),
        name: strike["localGroupName"] || "",
        location: strike["locationName"] || "",
        date: util.toUnixTimestamp(new Date(strike["dateTime"])) || "",
        eventLink: strike["eventLink"] || "",
        additionalInfo: strike["note"] || "",
        notificationSent: false,
        retrievedAt: now
      });
      newStrike.save();
    });
  }

  //checks and notifies for strikes that fulfill these conditions:
  //-notificationSent is false
  //-strike is within 24 hours from now
  //should be executed every hour
  public checkStrikes(): void {
    const tomorrow: number = util.toUnixTimestamp(new Date()) + day;
    const today: number = util.toUnixTimestamp(new Date());
    Strike.find(
      { notificationSent: false, date: { $gt: today, $lt: tomorrow } },
      function(err: Error, strikes) {
        if (err) return console.error(err);
        strikes.forEach(async strike => {
          console.log(strike);
          FCMAdmin.getInstance().sendMessage(
            `og_${strike["ogId"]}`,
            strike["ogId"],
            `Streikalarm in ${strike["name"]}`,
            `Demnächst findet hier ein Streik statt: ${strike["startingPoint"]}, ${strike["name"]}`
          );
          await Strike.updateOne(
            { ogId: strike["ogId"] },
            { notificationSent: true }
          );
        });
      }
    );
  }
}
