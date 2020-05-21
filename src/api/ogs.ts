import { OG } from "../models/ogs";
import { addPrefix } from "../utility";
import { addProtocolPrefix } from "../utility";
import * as util from "../utility";
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
        whatsapp: addProtocolPrefix(String(og["whatsapp"] || "")),
        email: addPrefix("mailto:", String(og["email"] || "")),
        instagram: addProtocolPrefix(String(og["instagram"] || "")),
        twitter: addProtocolPrefix(String(og["twitter"] || "")),
        facebook: addProtocolPrefix(String(og["facebook"] || "")),
        youtube: addProtocolPrefix(String(og["youtube"] || "")),
        website: addProtocolPrefix(String(og["website"] || "")),
        telegram: addProtocolPrefix(String(og["telegram"] || "")),
        other: og["other"] || "",
        retrievedAt: now
      },
      { upsert: true }
    );
  });

  //delete ogs that are still flagged
  const del = await OG.deleteMany({ other: "DELETE" });
  console.log("Threw out " + del.n + " old OGs.");
}
