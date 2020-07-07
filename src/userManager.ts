import { User } from "./models/userModel";
import crypto from "crypto"
import { util } from "prettier";
import Utility from "./utility";

// Manages users
//only static methods: no huge amounts of instances
//singleton scheme isnt used as this class doesnt handle services that can only be used by one instance at a time
export abstract class UserManager {
  
  public static hashPassword(password: string, salt: string): string {
    let hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    return hash.digest('hex');
  }

  public static generateRandomString(length: number): string {
    return crypto.randomBytes(Math.ceil(length / 2)).toString("hex").slice(0, length);
  }

  /**
   * Creates a new user (or changes existing users details)
   * 
   * params:
   * user: the userobject to create
   * sessionID: the session id of the session that wants to create the user
   * 
   * return: true, if creation was successful
   */
  public static async createUser(user: { username: string, admin: boolean }, sessionID: string): Promise<boolean> {
    console.log(`createUser(user: {username: ${user.username}, admin: ${user.admin}}, sessionID: ${sessionID})`);

    let { valid, admin } = await UserManager.checkSessionID(sessionID);

    if (valid && admin && (await User.find({ name: user.username })).length <= 0) { //lazy operator, so no database request if no privileges
      await User.create({
        name: user.username,
        admin: user.admin
      });
      return true;
    } else {
      return false;
    }
  }

  /**
   * updateUser
   * 
   * params:
   * user: the userobject to update
   * sessionID: the session id of the session that wants to update the user
   * 
   * return: true, if update was successful
   */
  public static async updateUser(user: { username: string, password: string, admin: boolean }, sessionID: string): Promise<boolean> {
    console.log(`updateUser(user: {username: ${user.username}, password: ${user.password}, admin: ${user.admin}}, sessionID: ${sessionID})`);

    let { valid, admin } = await UserManager.checkSessionID(sessionID);

    if (valid) {
      let salt = this.generateRandomString(16);
      let pwHash = this.hashPassword(user.password, salt);
      await User.findOneAndUpdate({ name: user.username }, {
        passwordHash: pwHash,
        salt: salt,
        admin: admin ? user.admin : false //only change admin status if session is admin (no privilege escalation)
      });
      return true;
    } else { return false; }
  }

  /**
   * Removes a user
   * 
   * params:
   * username: the name of the user to remove
   * sessionID: the session id of the session that wants to remove the user
   * 
   * return: true, if removal was successful
   */
  public static async removeUser(username: string, sessionID: string): Promise<boolean> {
    console.log(`removeUser(username: ${username}, sessionID: ${sessionID})`);

    let { valid, admin } = await UserManager.checkSessionID(sessionID);

    if (valid && admin) { //lazy operator, so no database request if no privileges
      await User.findOneAndDelete({
        name: username
      });
      return true;
    } else {
      return false;
    }
  }

  /**
   * Creates sessionid if credentials are correct
   * 
   * If user logs in for the first time, password is set
   * 
   * params:
   * username: the name of the user
   * password: the password of the user
   * 
   * return:
   * {
   *    valid: true, if credentials were accepted
   *    sessionID: the created sessionID
   * }
   */
  public static async login(username: string, password: string): Promise<{ valid: boolean; sessionID: string; }> {
    console.log(`login(username: ${username}, password: ${password})`);

    let user = await User.findOne({ name: username }); //check if user exists
    if (user == null || user == undefined) {
      return { valid: false, sessionID: "" }; //user doesnt exist
    }
    
    console.log(user);
    if (user["passwordHash"] == "") { //first time logging in (create new password)
      console.log("first time")
      let salt = this.generateRandomString(16);
      console.log(salt);
      let pwHash = this.hashPassword(password, salt);
      await User.findOneAndUpdate({ name: username }, {
        passwordHash: pwHash,
        salt: salt,
      });
    }

    let pwHash = this.hashPassword(password, user["salt"]);
    if (pwHash == user["passwordHash"]) { //check if hashes match
      let sessID = "fff_id_" + this.generateRandomString(16); //creates session id
      await User.findOneAndUpdate({ name: username }, {
        activeSession: sessID,
        expiration: Utility.toUnixTimestamp(new Date()) + Utility.Day //expires after a day
      });
      return { valid: true, sessionID: sessID }
    }
    return { valid: false, sessionID: "" };
  }

  /**
   * Ends session with sessionid
   * 
   * params:
   * sessionID: the session id of the session to end
   */
  public static async logout(sessionID: string) {
    console.log(`logout(sessionID: ${sessionID})`);

    await User.findOneAndUpdate({ activeSession: sessionID }, { activeSession: "", expiration: 0 });
  }

  /**
   * checks session id
   * 
   * params:
   * sessionID: the session id to check
   * 
   * return:
   * {
   *    valid: true, if sessionID is allowed
   *    admin: true, if session has admin privileges
   * }
   */
  public static async checkSessionID(sessionID: string): Promise<{ valid: boolean, admin: boolean }> {
    console.log(`checkSessionID(sessionID: ${sessionID})`);

    let res = await User.findOne({ activeSession: sessionID });
    if (res == null || res == undefined) {
      return { valid: false, admin: false }; //session id doesnt exist
    } else if (Utility.toUnixTimestamp(new Date()) < res["expiration"]) { //is session id not yet expired?
      return { valid: true, admin: res["admin"] };
    } else {
      return { valid: false, admin: false };
    }
  }
}
