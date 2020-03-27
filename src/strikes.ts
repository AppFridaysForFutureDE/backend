import { Strike } from "./models/strikes";
const apiUrlMapdata = "https://fridaysforfuture.de/map/mapdata.json";

export default class StrikeAccess {

  //retrieves Strikes from website api and saves them to mongodb
  //should be executed once per day
  public async retrieveStrikes() {
    //fetch strike json
    const fetch = require('node-fetch');
    const response = await fetch(apiUrlMapdata);
    let data = [];
    try { data = await response.json(); } catch (error) { return; }

    //delete all strikes
    const res = await Strike.deleteMany({});
    console.log("Deleted " + res.deletedCount + " Strikes");

    //loop through strikes and save them
    var i: number;
    for (i = 0; i < data.length; i++) {
      const newStrike = new Strike({
        name: data[i][" Name"],
        time: data[i][" Uhrzeit"],
        startingPoint: data[i][" Startpunkt"],
        fbEvent: data[i][" Facebook event"],
        additionalInfo: data[i][" zusatzinfo"],
        notificationSent: false,
        retrievedAt: Date.now()
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
