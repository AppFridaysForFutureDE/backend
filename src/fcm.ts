import * as admin from "firebase-admin";
export default class fcmAdmin {
  private authPath: string;

  constructor(ap: string) {
    this.authPath = ap;
    //Authentification
    var serviceAccount = require(this.authPath);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://de-fridaysforfuture-app.firebaseio.com"
    });
  }

  /**
   * sendMessage
   */
  public async sendMessage(topic: string, payload: string) {
    var message = {
      data: {
        payload: payload
      },
      topic: topic
    };
    try {
      const response = await admin.messaging().send(message);
      console.log('Successfully sent message:', response);
    } catch (error) {
      console.log('Error sending message:', error);
    }
  }
}
