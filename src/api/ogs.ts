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

  //delete ogs
  const res = await OG.deleteMany({});
  console.log(`Deleted ${res.n} ogs`);
  console.log(`Retrieved ${data.length} ogs`);

  data.forEach(async og => {
    let mail = "";
    if (og["email"] != null && !String(og["email"]).startsWith("mailto:")) {
      mail = "mailto:" + og["email"];
    }
    //save og
    const newOG = new OG({
      ogId: util.hash(og["name"]),
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
    });
    await newOG.save();
  });
}
