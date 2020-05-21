import { RequestHandler } from "express";
import * as strikeAccess from "../api/strikes";
import * as meetingAccess from "../api/meetings";
import * as ogAccess from "../api/ogs";
import { FCMAdmin } from "../services/fcm";
import { Liveevent } from "../models/liveevent";

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
  Liveevent.findOneAndUpdate(
    { liveeventId: req.body.id },
    {
      isActive: req.body.isActive,
      actionText: req.body.actionText,
      actionUrl: req.body.actionUrl
    },
    { upsert: true },
    function(err, doc) {
      res.status(200).json({ err: err });
    }
  );
};
