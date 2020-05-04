import { OG } from "../models/ogs";
import { addPrefix } from "../utility";
import * as util from "../utility";
import nodeFetch from "node-fetch";

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
  data.forEach(async og => {
    const ogid = util.hash(og["name"]);
    OG.findOneAndUpdate(
      { ogId: ogid },
      {
        ogId: ogid,
        name: og["name"] || "",
        bundesland: og["state"] || "",
        lat: og["lat"] || "",
        lon: og["lon"] || "",
        whatsapp: addPrefix("https://",String(og["whatsapp"] || "")),
        email: addPrefix("mailto:", String(og["email"] || "")),
        instagram: addPrefix("https://", String(og["instagram"] || "")),
        twitter: addPrefix("https://", String(og["twitter"] || "")),
        facebook: addPrefix("https://",String(og["facebook"] || "")),
        youtube: addPrefix("https://",String(og["youtube"] || "")),
        website: addPrefix("https://",String(og["website"] || "")),
        telegram: addPrefix("https://",String(og["telegram"] || "")),
        other: og["other"] || "",
        retrievedAt: now
      },
      { upsert: true },
      function(err, og) {}
    );
  });

  //delete ogs that are still flagged
  const del = await OG.deleteMany({ other: "DELETE" });
  console.log("Threw out " + del.n + " old OGs.");
}
