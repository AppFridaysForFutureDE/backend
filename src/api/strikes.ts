import { Strike } from "../models/strikes";
import * as util from "../utility";
import { FCMAdmin } from "../services/fcm";
import nodeFetch from "node-fetch";

//retrieves Strikes from website api and saves them to mongodb
export async function retrieveStrikes(): Promise<void> {
  const response = await nodeFetch(`${process.env.WEBSITE_URL}/strike`);
  let data = [];
  try {
    data = await response.json();
  } catch (error) {
    return;
  }

  //get retrievedAt date/time
  const now = Date.now();

  //loop through strikes
  data.forEach(strike => {
    Strike.findOneAndUpdate(
      { strikeId: strike["id"] },
      {
        strikeId: strike["id"],
        ogId: util.hash(strike["localGroupName"]),
        name: strike["localGroupName"] || "",
        location: strike["locationName"] || "",
        date: util.toUnixTimestamp(new Date(strike["dateTime"])) || "",
        eventLink: strike["eventLink"] || "",
        additionalInfo: strike["note"] || "",
        notificationSent: false,
        retrievedAt: now
      },
      { upsert: true },
      function(err, doc) {}
    );
  });
}

//checks and notifies for strikes that fulfill these conditions:
//-notificationSent is false
//-strike is within 24 hours from now
//should be executed every hour
export function checkStrikes(): void {
  const tomorrow: number = util.toUnixTimestamp(new Date()) + util.day;
  const today: number = util.toUnixTimestamp(new Date());
  Strike.find(
    { notificationSent: false, date: { $gt: today, $lt: tomorrow } },
    function(err: Error, strikes) {
      if (err) return console.error(err);
      strikes.forEach(async strike => {
        console.log(strike);
        FCMAdmin.getInstance().sendMessage(
          `og_${strike["ogId"]}`,
          `Streikalarm in ${strike["name"]}`,
          `Demnächst findet hier ein Streik statt: ${strike["startingPoint"]}, ${strike["name"]}`,
          "strike",
          strike["ogId"]
        );
        await Strike.updateOne(
          { ogId: strike["ogId"] },
          { notificationSent: true }
        );
      });
    }
  );
}
