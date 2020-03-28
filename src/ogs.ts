import { Og } from "./models/ogs";
const apiUrlOgs = "https://fridaysforfuture.de/api/?apikey=b6475bfd9547346572aff1535ef9af91&land=";
const bundeslaender = ["BW","BY","BE","BB","HB","HH","HE","MV","NI","NW","RP","SL","SN","ST","SH","TH"];
//const apiUrlOSM = "https://nominatim.openstreetmap.org/search?format=json&q=";
const fetch = require('node-fetch');

export default class OgAccess {

  public async retrieveOgs() {
    //delete all ogs
    const res = await Og.deleteMany({});
    console.log("Deleted " + res.deletedCount + " Ogs");

    //loop through bundeslaender
    var i = 0;
    for (i = 0; i < bundeslaender.length; i++) {
      //fetch json for bundesland
      const response = await fetch(apiUrlOgs+bundeslaender[i]);
      let data = [];
      try { data = await response.json(); } catch (error) { continue; }
      var b = 0;


      //loop through all ogs
      for (b = 0; b < data.length; b++) {
        //get coordinates
        const coordinates = await this.retrieveCoordinates(data[b]["Stadt"]);
        const newOg = new Og({
          name: data[b]["Stadt"],
          bundesland: bundeslaender[i],
          lat: coordinates[0],
          lon: coordinates[1],
          WhatsApp: data[b]["WhatsApp"],
          WhatsAppStud: data[b]["WhatsApp Studis"],
          Email: data[b]["eMail"],
          Instagram: data[b]["Instagram"],
          Twitter: data[b]["Twitter"],
          Facebook: data[b]["Facebook"],
          Website: data[b]["Website"],
          Telegram: data[b]["Telegram"],
          retrievedAt: Date.now()
        });

        await newOg.save();
      }
    }
  }

  public async retrieveCoordinates(city: String): Promise<[number, number]> {
    /*var lat: number;
    var lon: number;
    const response = await fetch(apiUrlOSM+city);
    let data = [];
    try { data = await response.json(); } catch (error) { return [0,0]; }
    if (data[0] == undefined || data[0] == null) { return [0,0]; }
    lat = data[0]["lat"];
    lon = data[0]["lon"];
    return [lat, lon];*/
    return [0,0];
  }

}
