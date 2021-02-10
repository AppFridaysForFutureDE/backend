import { OG } from "../models/ogsModel";
import Utility from "../Utility";
import nodeFetch from "node-fetch";

//retrieves ogs from website api and saves them to mongodb
export async function retrieveOGs(): Promise<void> {
  const response = await nodeFetch(`${process.env.WEBSITE_URL}/localGroups`);
  let data = [];
  try {
    data = await response.json();
  } catch (error) {
    console.log(error);
    return;
  }

  //get retrievedAt date/time
  const now = Date.now();

  //flag old ogs
  await OG.updateMany({}, { other: "DELETE" });

  //upsert ogs
  data.forEach(async (og) => {
    const ogid = Utility.hash(og["name"]);
    OG.findOneAndUpdate(
      { ogId: ogid },
      {
        ogId: ogid,
        name: og["name"] || "",
        bundesland: og["state"] || "",
        lat: og["lat"] || "",
        lon: og["lon"] || "",
        whatsapp: Utility.addProtocolPrefix(String(og["whatsapp"] || "")),
        email: Utility.addPrefix("mailto:", String(og["email"] || "")),
        instagram: Utility.addProtocolPrefix(String(og["instagram"] || "")),
        twitter: Utility.addProtocolPrefix(String(og["twitter"] || "")),
        facebook: Utility.addProtocolPrefix(String(og["facebook"] || "")),
        youtube: Utility.addProtocolPrefix(String(og["youtube"] || "")),
        website: Utility.addProtocolPrefix(String(og["website"] || "")),
        telegram: Utility.addProtocolPrefix(String(og["telegram"] || "")),
        other: og["other"] || "",
        retrievedAt: now,
      },
      { upsert: true },
      function (err, og) {
        console.log("error while upserting ogs");
        console.log(og);
        console.log(err);
      }
    );
  });

  //delete ogs that are still flagged
  const del = await OG.deleteMany({ other: "DELETE" });
  console.log("Threw out " + del.n + " old OGs.");
}
