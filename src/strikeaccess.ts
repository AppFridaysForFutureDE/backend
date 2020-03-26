import { Strike } from "./models/strikes";
const apiUrl = "https://fridaysforfuture.de/map/mapdata.json";

export default class StrikeAccess {

  //retrieves Strikes from website api and saves them to mongodb
  //should be executed once per day
  public async retrieveStrikes() {
    //fetch strike json
    const fetch = require('node-fetch');
    const response = await fetch(apiUrl);
    const data = await response.json();

    //delete all strikes
    const res = await Strike.deleteMany({});
    console.log("Deleted " + res.deletedCount + " Strikes");

    //loop through strikes and save them
    var i: number;
    for (i = 0; i < data.length; i++) {
      const newStrike = new Strike({
        city: data[i]["Stadt"],
        bundesland: data[i][" Bundesland"],
        name: data[i][" Name"],
        long: data[i][" lang"],
        lat: data[i][" lat"],
        time: data[i][" Uhrzeit"],
        startingPoint: data[i][" Startpunkt"],
        fbEvent: data[i][" Facebook event"],
        additionalInfo: data[i][" zusatzinfo"],
        facebook: data[i][" Facebook"],
        instagram: data[i][" Instagram"],
        twitter: data[i][" Twitter"],
        website: data[i][" website"],
        notificationSent: false
      });
      newStrike.save();
    }
  }

  //checks for strikes that fulfill these conditions:
  //-notificationSent is false
  //-strike is within 24 hours from now
  //should be executed every hour
  public checkStrikes() {
  }

}
