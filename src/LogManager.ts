import { Log } from "./models/logModel";
import Utility from "./Utility";

export default abstract class LogManager {
  public static async log(username: string, action: string, endpoint: string) {
    const time = Utility.toUnixTimestamp(new Date());
    const result = await Log.create({
      username: username,
      time: time,
      method: action,
      endpoint: endpoint
    });
  }

  public static async readLogs(): Promise<
    { time: string; user: string; action: string }[]
  > {
    let result = await Log.find({});
    result = result.sort((a, b) => {
      return a["time"] > b["time"] ? 1 : -1;
    });
    return result.map(doc => {
      return {
        time: new Date(doc["time"] * 1000)
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, ""), //some regex magic from SO to format date string
        user: doc["username"],
        action: `${doc["method"]} ${doc["endpoint"]}`
      };
    });
  }

  //delete logs older than a week
  public static async cleanLogs() {
    const minDate = Utility.toUnixTimestamp(new Date()) - 7 * Utility.Day; //a week before the current date
    await Log.deleteMany({ time: { $lt: minDate } });
  }
}
