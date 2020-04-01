import { Og } from "./models/ogs";
import { Coord } from "./models/coords";
import * as util from "./utility";
import nodeFetch from "node-fetch";

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

export default class OgAccess {
  public async retrieveOgs() {
    //loop through bundeslaender
    let i = 0;
    for (i = 0; i < bundeslaender.length; i++) {
      const url = `${process.env.OG_URL}&land=${bundeslaender[i]}`;
      //fetch json for bundesland
      const response = await nodeFetch(url);
      let data = [];
      try {
        data = await response.json();
      } catch (error) {
        continue;
      }

      //delete all ogs
      const res = await Og.deleteMany({ bundesland: bundeslaender[i]});

      //loop through all ogs
      let b = 0;
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
    //check if city is already in cache
    let coordCached = await Coord.findOne({city: city});
    if (coordCached != undefined && coordCached != null) {
      return [coordCached["lat"],coordCached["lon"]];
    }

    console.log(city);

    //fetch json for city
    const url = `${process.env.MAPS_URL}${encodeURIComponent(city)}`;
    const response = await nodeFetch(url);
    let data = [];
    try {
      data = await response.json();
    } catch (error) {
      console.log("Google Maps fetch failed");
      console.log(error);
      return [0,0];
    }

    //get lat/long from json
    let lat = data["results"][0]["geometry"]["location"]["lat"];
    let lon = data["results"][0]["geometry"]["location"]["lng"];

    //save in cache
    let newCoord = new Coord({
      city: city,
      lat: lat,
      lon: lon
    });
    await newCoord.save()

    return [lat,lon];
  }
}
