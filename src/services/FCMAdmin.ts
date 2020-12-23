import * as admin from "firebase-admin";

// Sends push notifications via Firebase Cloud Messaging
export default class FCMAdmin {
  private static instance: FCMAdmin;
  private firebaseReady: boolean;

  private constructor() {
    try {
      if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        throw "Warning: Connection to firebase could not be established. No credentials provided";
      }

      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        databaseURL: process.env.FIREBASE_URL,
      });
      this.firebaseReady = true;
      console.log("Successfully established connection to firebase.");
    } catch (error) {
      console.log(error);
      this.firebaseReady = false;
    }
  }

  static getInstance(): FCMAdmin {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new FCMAdmin();
    return this.instance;
  }

  public getStatus(): boolean {
    return this.firebaseReady;
  }

  public async sendMessage(
    topic: string,
    title: string,
    body: string,
    type: string,
    payload: string
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
        body: body,
      },
      data: {
        payload: payload,
        type: type,
        click_action: "FLUTTER_NOTIFICATION_CLICK" // eslint-disable-line
      },
      topic: topic,
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
