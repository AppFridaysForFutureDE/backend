import { RequestHandler } from "express";
import * as strikeAccess from "../data/strikes";
import * as meetingAccess from "../data/meetings";
import * as ogAccess from "../data/ogs";
import { Liveevent } from "../models/liveeventModel";

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
      actionUrl: req.body.actionUrl,
      inApp: req.body.inApp
    },
    { upsert: true },
    function(err, doc) {
      res.status(200).json({ err: err, doc: doc });
    }
  );
};

export const login: RequestHandler = async (req, res) => {
  res.status(200).json({ message: "not implemented" });
};

export const logout: RequestHandler = async (req, res) => {
  res.status(200).json({ message: "not implemented" });
};

//only admin from here
export const remove: RequestHandler = async (req, res) => {
  res.status(200).json({ message: "not implemented" });
};

export const register: RequestHandler = async (req, res) => {
  res.status(200).json({ message: "not implemented" });
};

export const privilege: RequestHandler = async (req, res) => {
  res.status(200).json({ message: "not implemented" });
};