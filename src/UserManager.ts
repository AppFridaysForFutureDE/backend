import { User } from "./models/userModel";
import crypto from "crypto";
import Utility from "./Utility";
import bcrypt from "bcrypt";

// Manages users
//only static methods: no huge amounts of instances
export default abstract class UserManager {
  private static hashPassword(password: string): Promise<string> {
    const hashpw = bcrypt.hashSync(password, 10);
    return hashpw;
  }

  private static checkPasswordHash(hash, password): boolean {
    return bcrypt.compareSync(password, hash);
  }

  private static generateRandomString(length: number): string {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString("hex")
      .slice(0, length);
  }

  private static async createSessionID(
    username: string
  ): Promise<{ valid: boolean; sessionID: string }> {
    const sessID = "fff_id_" + this.generateRandomString(16); //creates session id
    await User.findOneAndUpdate(
      { name: username },
      {
        activeSession: sessID,
        expiration: Utility.toUnixTimestamp(new Date()) + Utility.Hour, //expires after an hour
      }
    );
    return { valid: true, sessionID: sessID };
  }

  public static async changePassword(
    username: string,
    passwordNew: string
  ): Promise<boolean> {
    const pwHash = this.hashPassword(passwordNew);
    await User.findOneAndUpdate(
      { name: username },
      {
        passwordHash: pwHash,
      },
      { upsert: true }
    );
    return true;
  }

  public static async makeAdmin(username: string): Promise<boolean> {
    await User.findOneAndUpdate(
      { name: username },
      {
        admin: true,
      }
    );
    return true;
  }

  public static async removeUser(username: string): Promise<boolean> {
    await User.findOneAndDelete({
      name: username,
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
      const pwHash = this.hashPassword(password);
      await User.findOneAndUpdate(
        { name: username },
        {
          passwordHash: pwHash,
        }
      );

      //create session id
      return await this.createSessionID(username);
    }

    if (this.checkPasswordHash(user["passwordHash"], password)) {
      //check if hashes match
      return await this.createSessionID(username);
    }
    return { valid: false, sessionID: "" };
  }

  //Ends session with sessionid
  public static async logout(sessionID: string): Promise<boolean> {
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
          expiration: Utility.toUnixTimestamp(new Date()) + Utility.Hour, //expiration is reset when stuff is done
        }
      );
      return { valid: true, admin: res["admin"], name: res["name"] };
    } else {
      return { valid: false, admin: false, name: "" }; //sessionid is invalid or expired
    }
  }
}
