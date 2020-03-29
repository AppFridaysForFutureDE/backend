import { Og } from "./models/ogs";
import * as util from "./utility";
import * as api from "./auth/apis"

const bundeslaender = [
  "BW",
  "BY",
  "BE",
  "BB",
  "HB",
  "HH",
  "HE",
  "MV",
  "NI",
  "NW",
  "RP",
  "SL",
  "SN",
  "ST",
  "SH",
  "TH"
];
//const apiUrlOSM = "https://nominatim.openstreetmap.org/search?format=json&q=";
const fetch = require("node-fetch");

export default class OgAccess {

  public async retrieveOgs() {
    //delete all ogs
    const res = await Og.deleteMany({});
    console.log("Deleted " + res.deletedCount + " Ogs");

    //loop through bundeslaender
    let i = 0;
    for (i = 0; i < bundeslaender.length; i++) {
      //fetch json for bundesland
      const response = await fetch(api.urlOgs + bundeslaender[i]);
      let data = [];
      try {
        data = await response.json();
      } catch (error) {
        continue;
      }
      let b = 0;

      //loop through all ogs
      for (b = 0; b < data.length; b++) {
        //get coordinates
        const coordinates = await this.retrieveCoordinates(data[b]["Stadt"]);
        const newOg = new Og({
          ogId: util.hash(data[b]["Stadt"]),
          name: data[b]["Stadt"],
          bundesland: bundeslaender[i],
          lat: coordinates[0],
          lon: coordinates[1],
          whatsApp: data[b]["WhatsApp"],
          whatsAppStud: data[b]["WhatsApp Studis"],
          email: data[b]["eMail"],
          instagram: data[b]["Instagram"],
          twitter: data[b]["Twitter"],
          facebook: data[b]["Facebook"],
          website: data[b]["Website"],
          telegram: data[b]["Telegram"],
          retrievedAt: Date.now()
        });

        await newOg.save();
      }
    }
  }

  public async retrieveCoordinates(city: string): Promise<[number, number]> {
    return [0, 0];
  }

}
