import { Strike } from "../models/strikesModel";
import Utility from "../Utility";
import FCMAdmin from "../services/FCMAdmin";
import nodeFetch from "node-fetch";

export async function retrieveStrikesNew(): Promise<void> {
  const response = await nodeFetch(
    "https://fridaysforfuture.de/map/mapdata-25.json"
  );
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
    const ogId = Utility.hash(strike[" Name"]);
    const name = strike[" Name"];
    const location = strike[" Startpunkt"];
    const eventLink = strike[" Facebook event"];

    const additionalInfo = strike[" zusatzinfo"];

    const id = `25sep${ogId}`;

    /* " Uhrzeit": "10:00 Uhr", */
    const time: string = strike[" Uhrzeit"];

    let hours = 0;
    let minutes = 0;

    try {
      const splitTime = time.split(":");
      if (splitTime.length === 2) {
        hours = parseInt(splitTime[0]) - 2;
        minutes = parseInt(splitTime[1].split(" ")[0]);
      }
    } catch (err) {
      console.log(`could not parse time ${time}`);
    }

    const jsDate = new Date(2020, 8, 25, hours, minutes);
    const date = Utility.toUnixTimestamp(jsDate);

    Strike.findOneAndUpdate(
      /* { strikeId: strike["id"] }, */
      { strikeId: id },
      {
        /* strikeId: strike["id"], */
        strikeId: id,
        /* ogId: Utility.hash(strike["localGroupName"]), */
        ogId: ogId,
        /* name: strike["localGroupName"] || "", */
        name: name || "",
        location: location || "",
        date: date || "",
        eventLink: eventLink || "",
        additionalInfo: additionalInfo || "",
        retrievedAt: now
      },
      { upsert: true },
      function(err, doc) {
        console.log("error while updating strikes");
        console.log(doc);
        console.log(err);
      }
    );
  });
}

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
        ogId: Utility.hash(strike["localGroupName"]),
        name: strike["localGroupName"] || "",
        location: strike["locationName"] || "",
        date: Utility.toUnixTimestamp(new Date(strike["dateTime"])) || "",
        eventLink: strike["eventLink"] || "",
        additionalInfo: strike["note"] || "",
        retrievedAt: now
      },
      { upsert: true },
      function(err, doc) {
        console.log("error while updating strikes");
        console.log(doc);
        console.log(err);
      }
    );
  });
}

//checks and notifies for strikes that fulfill these conditions:
//-notificationSent is false or not set
//-strike is within 24 hours from now
//should be executed every hour
export function checkStrikes(): void {
  const tomorrow: number = Utility.toUnixTimestamp(new Date()) + Utility.Day;
  const today: number = Utility.toUnixTimestamp(new Date());
  Strike.find({ date: { $gt: today, $lt: tomorrow } }, function(
    err: Error,
    strikes
  ) {
    //check if an error occured
    if (err) return console.error(err);

    //loop through strikes
    strikes.forEach(async strike => {
      if (
        strike["notificationSent"] == "false" ||
        strike["notificationSent"] == null
      ) {
        //send notification
        FCMAdmin.getInstance().sendMessage(
          `og_${strike["ogId"]}`,
          `Streikalarm in ${strike["name"]}`,
          `Demnächst findet hier ein Streik statt: ${strike["location"]}, ${strike["name"]}`,
          "strike",
          strike["ogId"]
        );

        //Update Notification Status of strike
        await Strike.updateOne(
          { strikeId: strike["strikeId"] },
          { notificationSent: true }
        );
      }
    });
  });
}
