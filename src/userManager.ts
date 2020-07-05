// Manages users
export class UserManager {
  private static instance: UserManager;

  private constructor() {
  }

  static getInstance(): UserManager {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new UserManager();
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
    console.log(`createUser(user: {username: ${user.username}, password: ${user.password}, admin: ${user.admin}}, sessionID: ${sessionID})`);
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
    console.log(`updateUser(user: {username: ${user.username}, password: ${user.password}, admin: ${user.admin}}, sessionID: ${sessionID})`);
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
    console.log(`removeUser(username: ${username}, sessionID: ${sessionID})`);
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
    console.log(`login(username: ${username}, password: ${password})`);
    return { valid: false, sessionID: ""};
  }

  /**
   * Ends session with sessionid
   * 
   * params:
   * sessionID: the session id of the session to end
   */
  public logout(sessionID: string) {
    console.log(`logout(sessionID: ${sessionID})`);
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
    console.log(`checkSessionID(sessionID: ${sessionID})`);
    return {valid: false, admin: false};
  }
}
