import { User } from "./models/userModel";
import crypto from "crypto";
import Utility from "./Utility";

// Manages users
//only static methods: no huge amounts of instances
export default abstract class UserManager {
  public static hashPassword(password: string, salt: string): string {
    const hash = crypto.createHmac("sha512", salt);
    hash.update(password);
    return hash.digest("hex");
  }

  public static generateRandomString(length: number): string {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString("hex")
      .slice(0, length);
  }

  public static async createSessionID(
    username: string
  ): Promise<{ valid: boolean; sessionID: string }> {
    const sessID = "fff_id_" + this.generateRandomString(16); //creates session id
    await User.findOneAndUpdate(
      { name: username },
      {
        activeSession: sessID,
        expiration: Utility.toUnixTimestamp(new Date()) + Utility.Hour //expires after an hour
      }
    );
    return { valid: true, sessionID: sessID };
  }

  public static async createUser(user: {
    username: string;
    admin: boolean;
  }): Promise<boolean> {
    await User.create({
      name: user.username,
      admin: user.admin
    });
    return true;
  }

  public static async changePassword(
    username: string,
    passwordNew: string
  ): Promise<boolean> {
    const salt = this.generateRandomString(16);
    const pwHash = this.hashPassword(passwordNew, salt);
    await User.findOneAndUpdate(
      { name: username },
      {
        passwordHash: pwHash,
        salt: salt
      },
      { upsert: true }
    );
    return true;
  }

  public static async makeAdmin(username: string): Promise<boolean> {
    await User.findOneAndUpdate(
      { name: username },
      {
        admin: true
      }
    );
    return true;
  }

  public static async removeUser(username: string): Promise<boolean> {
    await User.findOneAndDelete({
      name: username
    });
    return true;
  }

  //Creates sessionid if credentials are correct
  public static async login(
    username: string,
    password: string
  ): Promise<{ valid: boolean; sessionID: string }> {
    const user = await User.findOne({ name: username }); //check if user exists
    if (user == null || user == undefined) {
      return { valid: false, sessionID: "" }; //user doesnt exist
    }

    if (user["passwordHash"] == undefined || user["passwordHash"] == null) {
      //first time logging in (create new password)
      const salt = this.generateRandomString(16);
      const pwHash = this.hashPassword(password, salt);
      await User.findOneAndUpdate(
        { name: username },
        {
          passwordHash: pwHash,
          salt: salt
        }
      );

      //create session id
      return await this.createSessionID(username);
    }

    const pwHash = this.hashPassword(password, user["salt"]);
    if (pwHash == user["passwordHash"]) {
      //check if hashes match
      return await this.createSessionID(username);
    }
    return { valid: false, sessionID: "" };
  }

  //Ends session with sessionid
  public static async logout(sessionID: string): Promise<boolean> {
    console.log(`logout(sessionID: ${sessionID})`);

    await User.findOneAndUpdate(
      { activeSession: sessionID },
      { activeSession: "", expiration: 0 }
    );
    return true;
  }

  //checks a session id
  public static async checkSessionID(
    sessionID: string
  ): Promise<{ valid: boolean; admin: boolean; name: string }> {
    const res = await User.findOne({ activeSession: sessionID });
    if (res && Utility.toUnixTimestamp(new Date()) < res["expiration"]) {
      User.findOneAndUpdate(
        { activeSession: sessionID },
        {
          expiration: Utility.toUnixTimestamp(new Date()) + Utility.Hour //expiration is reset when stuff is done
        }
      );
      return { valid: true, admin: res["admin"], name: res["name"] };
    } else {
      return { valid: false, admin: false, name: "" }; //sessionid is invalid or expired
    }
  }
}
