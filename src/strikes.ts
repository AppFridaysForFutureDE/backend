import { Strike } from "./models/strikes";
export default class StrikeAccess {

  //retrieves Strikes from website api and saves them to mongodb
  //should be executed once per day
  public async retrieveStrikes() {

  }

  //checks for strikes that fulfill these conditions:
  //-notificationSent is false
  //-strike is within 24 hours from now
  //should be executed every hour
  public checkStrikes() {

  }

}
