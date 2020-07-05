// Manages users
export class userManager {
  private static instance: userManager;

  private constructor() {
  }

  static getInstance(): userManager {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new userManager();
    return this.instance;
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
  public createUser(user: {username: string, password: string, admin: boolean}, sessionID: string): boolean {
    return false;
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
  public updateUser(user: {username: string, password: string, admin: boolean}, sessionID: string): boolean {
    return false;
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
  public removeUser(username: string, sessionID: string): boolean {
    return false;
  }

  /**
   * Creates sessionid if credentials are correct
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
  public login(username: string, password: string): { valid: boolean, sessionID: string} {
    return { valid: false, sessionID: ""};
  }

  /**
   * Ends session with sessionid
   * 
   * params:
   * sessionID: the session id of the session to end
   */
  public logout(sessionID: string) {

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
  public checkSessionID(sessionID: string): { valid: boolean, admin: boolean } {
    return {valid: false, admin: false};
  }
}
