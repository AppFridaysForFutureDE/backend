import { Strike } from "./models/strikes";
const apiUrl = "https://fridaysforfuture.de/map/mapdata.json";

export default class StrikeAccess {

  //retrieves Strikes from website api and saves them to mongodb
  //should be executed once per day
  public async retrieveStrikes() {
    var Client = require("node-rest-client").Client();
    var client = new Client();
    client.get(apiUrl, function (data, response) {
      // parsed response body as js object
      console.log(data);
      //
      //    Parse and save Data here
      //
    });
  }

  //checks for strikes that fulfill these conditions:
  //-notificationSent is false
  //-strike is within 24 hours from now
  //should be executed every hour
  public checkStrikes() {
  }

}
