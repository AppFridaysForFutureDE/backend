import { RequestHandler } from "express";
import * as strikeAccess from "../api/strikes";
import * as meetingAccess from "../api/meetings";
import * as ogAccess from "../api/ogs";
import { FCMAdmin } from "../services/fcm";

export const firebaseStatus: RequestHandler = (req, res) => {
  console.log("Firebase status requested");
  FCMAdmin.getInstance().getStatus();
  res.status(200).json({ firebaseStatus: FCMAdmin.getInstance().getStatus() });
};

export const populateDB: RequestHandler = async (req, res) => {
  console.log("Populating DB");
  await Promise.all([
    ogAccess.retrieveOGs(),
    strikeAccess.retrieveStrikes(),
    meetingAccess.retrieveMeetings()
  ]);
  res.status(200).json({ performedPopulate: true });
};

export const debugPost: RequestHandler = async (req, res) => {
  //Add debug code here
  await strikeAccess.checkStrikes();
  res.status(200).json({ Debug: true });
};

export const debugGet: RequestHandler = async (req, res) => {
  //Add debug code here
  res.status(200).json({ Debug: true });
};