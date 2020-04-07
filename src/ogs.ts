import { OG } from "./models/ogs";
import * as util from "./utility";
import nodeFetch from "node-fetch";

export default class OGAccess {
  public async retrieveOGs(): Promise<void> {
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
      //save og
      const newOG = new OG({
        ogId: util.hash(og["name"]),
        name: og["name"] || "",
        bundesland: og["state"] || "",
        lat: og["lat"] || "",
        lon: og["lon"] || "",
        whatsapp: og["whatsapp"] || "",
        email: og["email"] || "",
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
}
