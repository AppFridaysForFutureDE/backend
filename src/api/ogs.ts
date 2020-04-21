import { OG } from "../models/ogs";
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
    //add mailto prefix to mail adresses
    let mail = "";
    if (og["email"] != null && !String(og["email"]).startsWith("mailto:")) {
      mail = "mailto:" + og["email"];
    }
    const ogid = util.hash(og["name"]);
    OG.findOneAndUpdate(
      { ogId: ogid },
      {
        ogId: ogid,
        name: og["name"] || "",
        bundesland: og["state"] || "",
        lat: og["lat"] || "",
        lon: og["lon"] || "",
        whatsapp: og["whatsapp"] || "",
        email: mail,
        instagram: og["instagram"] || "",
        twitter: og["twitter"] || "",
        facebook: og["facebook"] || "",
        youtube: og["youtube"] || "",
        website: og["website"] || "",
        telegram: og["telegram"] || "",
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
