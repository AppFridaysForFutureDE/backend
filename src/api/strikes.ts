import { Strike } from "../models/strikes";
import * as util from "../utility";
import { FCMAdmin } from "../services/fcm";
import nodeFetch from "node-fetch";

//retrieves Strikes from website api and saves them to mongodb
export async function retrieveStrikes(): Promise<void> {
  console.log("strikes");
  const response = await nodeFetch(/*`${process.env.WEBSITE_URL}/strike`*/"https://api.jsonbin.io/b/5ec27b662bb52645e553112f/1", { headers: { 'secret-key': '$2b$10$ceg0l3mqvyAF0WUBsD4k6eA/IUAQ73p/L09VI4b6Xc1PcxPHiuu.C' }});
  let data = [];
  try {
    data = await response.json();
  } catch (error) {
    return;
  }

  //get retrievedAt date/time
  const now = Date.now();

  console.log("upsert strikes");
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
        retrievedAt: now
      },
      { upsert: true },
      function(err, doc) {}
    );
  });
}


//TODO: Use strikeId instead of og id
//TODO: check notificationSent manually (if non existent or false => send notification)
//checks and notifies for strikes that fulfill these conditions:
//-notificationSent is false
//-strike is within 24 hours from now
//should be executed every hour
export function checkStrikes(): void {
  const tomorrow: number = util.toUnixTimestamp(new Date()) + util.day;
  const today: number = util.toUnixTimestamp(new Date());
  Strike.find(
    { date: { $gt: today, $lt: tomorrow } },
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
