import { RequestHandler } from "express";
import * as strikeAccess from "../api/strikes";
import * as meetingAccess from "../api/meetings";
import * as ogAccess from "../api/ogs";
import { FCMAdmin } from "../services/fcm";
import { Liveevent } from "../models/liveevent";
import parseFormdata from "parse-formdata";

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

export const saveLiveevent: RequestHandler = async (req, res) => {
  console.log("Saving liveevent");

  parseFormdata(req, function(err, data) {
    res.status(200).json({ fields: data.fields });
  });
};
