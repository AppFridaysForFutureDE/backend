import * as admin from "firebase-admin";
export default class FCMAdmin {
  private firebaseReady: boolean;

  constructor() {
    // Authentification
    try {
      if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        throw "Warning: Connection to firebase could not be established. No credentials provided";
      }

      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        databaseURL: process.env.FIREBASE_URL
      });
      this.firebaseReady = true;
      console.log("Successfully established connection to firebase.");
    } catch (error) {
      console.log(error);
      this.firebaseReady = false;
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
  ): Promise<void> {
    if (!this.firebaseReady) {
      console.log(
        "Firebase is not initialized. Maybe the firebase credential file is missing."
      );
      return;
    }
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
