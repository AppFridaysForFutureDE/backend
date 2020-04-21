import { RequestHandler } from "express";
import * as strikeAccess from "../api/strikes";
import * as ogAccess from "../api/ogs";
import { FCMAdmin } from "../services/fcm";

export const firebaseStatus: RequestHandler = (req, res) => {
  console.log("Firebase status requested");
  FCMAdmin.getInstance().getStatus();
  res.status(200).json({ firebaseStatus: FCMAdmin.getInstance().getStatus() });
};

export const populateDB: RequestHandler = async (req, res) => {
  console.log("Populating DB");
  await Promise.all([ogAccess.retrieveOGs(), strikeAccess.retrieveStrikes()]);
  res.status(200).json({ performedPopulate: true });
};
