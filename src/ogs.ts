import { Og } from "./models/ogs"
import * as util from "./utility";
import nodeFetch from "node-fetch";

export default class OgAccess {
  public async retrieveOgs() {
    const response = await nodeFetch(process.env.OG_URL);
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
    const res = await Og.deleteMany({});
    console.log(`Deleted ${res.n} ogs`);

    data.forEach(async og => {
      //save og
      const newOg = new Og({
        ogId: util.hash(og["name"]),
        name: og["name"],
        bundesland: og["state"],
        lat: og["lat"],
        lon: og["lon"],
        whatsApp: og["whatsapp"],
        email: og["email"],
        instagram: og["instagram"],
        twitter: og["twitter"],
        facebook: og["facebook"],
        youtube: og["youtube"],
        website: og["website"],
        telegram: og["telegram"],
        other: og["other"],
        retrievedAt: now
      });
      await newOg.save();
    });
  }
}
