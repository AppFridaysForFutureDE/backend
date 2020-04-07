import crypto from "crypto";
import { Coord } from "./models/coords";
import nodeFetch from "node-fetch";

//returns date of next weekday (1: Mon, 7: Sun)
export function nextWeekdayDate(dayInWeek: number): Date {
  const ret = new Date();
  ret.setDate(ret.getDate() + ((dayInWeek - 1 - ret.getDay() + 7) % 7) + 1);
  return ret;
}

//DEPRECATED
//parses a string of this scheme: "13:00 Uhr" to a date with the next friday
export function getDate(s: string): Date {
  const d = nextWeekdayDate(5);
  d.setSeconds(0);
  d.setMilliseconds(0);
  const re = /[0-9]{2}/g;
  const m = s.match(re);
  if (m) {
    d.setHours(+m[0], +m[1]);
    return d;
  }
  throw new Error("No valid date!");
}

//converts date to unix timestamp
export function toUnixTimestamp(d: Date): number {
  let x: number = d.getTime();
  x = x / 1000;
  return x;
}

//creates shortened sha256 hash
export function hash(s: string): string {
  return crypto
    .createHash("sha256")
    .update(s)
    .digest("hex")
    .substring(0, 13);
}

//DEPRECATED
//gets coordinates for place and checks cache first
//relict from before the new api
export async function retrieveCoordinates(
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
