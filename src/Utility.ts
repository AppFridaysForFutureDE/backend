import crypto from "crypto";
import { Coord } from "./models/coordsModel";
import nodeFetch from "node-fetch";

//TODO: Make static class

export default class Utility {
  //unix time
  public static readonly Day = 86401;
  public static readonly Hour = 3600;

  //adds a custom prefix if prefix isnt there already and text isnt empty
  public static addPrefix(prefix: string, text: string): string {
    if (text != null && !text.startsWith(prefix) && text != "") {
      text = prefix + text;
    }
    return text;
  }

  //adds standard protocol prefix if there is none and text isnt empty
  public static addProtocolPrefix(text: string): string {
    if (
      text != null &&
      text != "" &&
      !(text.startsWith("https://") || text.startsWith("http://"))
    ) {
      text = "http://" + text;
    }
    return text;
  }

  //returns date of next weekday (1: Mon, 7: Sun)
  public static nextWeekdayDate(dayInWeek: number): Date {
    const ret = new Date();
    ret.setDate(ret.getDate() + ((dayInWeek - 1 - ret.getDay() + 7) % 7) + 1);
    return ret;
  }

  //converts date to unix timestamp
  public static toUnixTimestamp(d: Date): number {
    let x: number = d.getTime();
    x = x / 1000;
    return x;
  }

  //creates shortened sha256 hash
  public static hash(s: string): string {
    return crypto
      .createHash("sha256")
      .update(s)
      .digest("hex")
      .substring(0, 13);
  }

  //DEPRECATED
  //gets coordinates for place and checks cache first
  //relict from before the new api
  public static async retrieveCoordinates(
    city: string
  ): Promise<[number, number]> {
    //check if city is already in cache
    const coordCached = await Coord.findOne({ city: city });
    if (coordCached != undefined && coordCached != null) {
      return [coordCached["lat"], coordCached["lon"]];
    }

    //fetch json for city
    const url = `${process.env.MAPS_URL}${encodeURIComponent(city)}`;
    const response = await nodeFetch(url);
    let data = [];
    try {
      data = await response.json();
    } catch (error) {
      console.log("Google Maps fetch failed");
      console.log(error);
      return [0, 0];
    }

    //get lat/long from json
    let lat = 0;
    let lon = 0;
    try {
      lat = data["results"][0]["geometry"]["location"]["lat"];
      lon = data["results"][0]["geometry"]["location"]["lng"];
    } catch {
      console.log(`Fetch didnt work for: ${city}`);
    }

    //save in cache
    const newCoord = new Coord({
      city: city,
      lat: lat,
      lon: lon
    });
    await newCoord.save();

    return [lat, lon];
  }
}