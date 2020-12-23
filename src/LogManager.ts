import { Log } from "./models/logModel";
import Utility from "./Utility";
import { Request } from "express";

export default abstract class LogManager {
  public static async log(req: Request): Promise<boolean> {
    const time = Utility.toUnixTimestamp(new Date());
    const result = await Log.create({
      username: req.auth.name,
      time: time,
      method: req.method,
      endpoint: req.url,
      ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
    });
    return result ? true : false;
  }

  public static async readLogs(): Promise<
    { time: string; user: string; ip: string; action: string }[]
  > {
    let result = await Log.find({});
    result = result.sort((a, b) => {
      return a["time"] > b["time"] ? 1 : -1;
    });
    return result.map((doc) => {
      return {
        time: new Date(doc["time"] * 1000)
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, ""), //some regex magic from SO to format date string
        user: doc["username"],
        ip: doc["ip"],
        action: `${doc["method"]} ${doc["endpoint"]}`,
      };
    });
  }

  //delete logs older than a week
  public static async cleanLogs(): Promise<number> {
    const minDate = Utility.toUnixTimestamp(new Date()) - 7 * Utility.Day; //a week before the current date
    const result = await Log.deleteMany({ time: { $lt: minDate } });
    return result.deletedCount || 0;
  }
}
