import { Strike } from "./models/strikes";
const apiUrlMapdata = "https://fridaysforfuture.de/map/mapdata.json";

export default class StrikeAccess {
  //retrieves Strikes from website api and saves them to mongodb
  //should be executed once per day
  public async retrieveStrikes() {
    //fetch strike json
    const fetch = require("node-fetch");
    const response = await fetch(apiUrlMapdata);
    let data = [];
    try {
      data = await response.json();
    } catch (error) {
      return;
    }

    //delete all strikes
    const res = await Strike.deleteMany({});
    console.log("Deleted " + res.deletedCount + " Strikes");

    //loop through strikes and save them
    let i: number;
    for (i = 0; i < data.length; i++) {
      const newStrike = new Strike({
        name: data[i][" Name"],
        date: this.getDate(data[i][" Uhrzeit"]),
        startingPoint: data[i][" Startpunkt"],
        fbEvent: data[i][" Facebook event"],
        additionalInfo: data[i][" zusatzinfo"],
        notificationSent: false,
        retrievedAt: Date.now()
      });
      newStrike.save();
    }
  }

  //parses a string of this scheme: "13:00 Uhr" to a date with the next friday
  public getDate(s: string): Date {
    const d = this.nextWeekdayDate(5);
    d.setSeconds(0);
    d.setMilliseconds(0);
    const re = /[0-9]{2}/g;
    const m = s.match(re);
    if (m) {
      d.setHours(+m[0], +m[1]);
      return d;
    }
    return new Date();
  }

  //returns date of next weekday (1: Mon, 7: Sun)
  public nextWeekdayDate(dayInWeek): Date {
    const ret = new Date();
    ret.setDate(ret.getDate() + ((dayInWeek - 1 - ret.getDay() + 7) % 7) + 1);
    return ret;
  }

  //checks for strikes that fulfill these conditions:
  //-notificationSent is false
  //-strike is within 24 hours from now
  //should be executed every hour
  public checkStrikes() {}
}
