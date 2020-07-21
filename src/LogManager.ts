import { Log } from "./models/logModel";
import Utility from "./Utility";

export default abstract class LogManager {
  public static async log(username: String, action: String, endpoint: String) {
    let time = Utility.toUnixTimestamp(new Date());
    let result = await Log.create({
        username: username,
        time: time,
        action: action,
        enpoint: endpoint
    });
  }

  public static async readLogs(): Promise<{time: String, user: String, action: String}[]> {
    let result = await Log.find({});
    result = result.sort((a,b) => {
        return (a["time"] > b["time"]) ? 1 : -1;
    })
    return result.map((doc) => {
        return {
            time: new Date(doc["time"] * 1000).toISOString().replace(/T/, ' ').replace(/\..+/, ''),//some regex magic from SO to format date string
            user: doc["username"],
            action: `${doc["action"]} ${doc["endpoint"]}`
        };
    });
  }

  //delete logs older than a week
  public static async cleanLogs() {
      let minDate = Utility.toUnixTimestamp(new Date()) - 7 * Utility.Day; //a week before the current date
      await Log.deleteMany({ time: { $lt: minDate }});
  }
}
