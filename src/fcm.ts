import * as admin from "firebase-admin";
export default class FCMAdmin {
  private authPath: string;

  constructor(ap: string) {
    this.authPath = ap;
    // Authentification
    try {
      const serviceAccount = require(this.authPath);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://de-fridaysforfuture-app.firebaseio.com"
      });
    } catch (error) {
      console.log(
        "Connection to firebase could not be established. Maybe the firebase credential file is missing."
      );
    }
  }

  /**
   * sendMessage
   */
  public async sendMessage(
    topic: string,
    payload: string,
    title: string,
    body: string
  ) {
    const message = {
      notification: {
        title: title,
        body: body
      },
      data: {
        payload: payload
      },
      topic: topic
    };
    console.log("Sending message:");
    console.log(message);
    try {
      const response = await admin.messaging().send(message);
      console.log("Successfully sent message:", response);
    } catch (error) {
      console.log("Error sending message:", error);
    }
  }
}
