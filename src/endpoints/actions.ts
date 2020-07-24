import { RequestHandler } from "express";
import * as strikeAccess from "../data/strikes";
import * as meetingAccess from "../data/meetings";
import * as ogAccess from "../data/ogs";
import { Liveevent } from "../models/liveeventModel";

export const populateDB: RequestHandler = async (req, res) => {
  if (req.auth.valid) {
    await Promise.all([
      ogAccess.retrieveOGs(),
      strikeAccess.retrieveStrikes(),
      meetingAccess.retrieveMeetings()
    ]);
    res.status(200).json({ performedPopulate: true });
  } else {
    res.status(200).json({ performedPopulate: false });
  }
};

export const saveLiveevent: RequestHandler = async (req, res) => {
  console.log(req.body);
  if (req.auth.valid) {
    const result = await Liveevent.findOneAndUpdate(
      { liveeventId: req.body.id },
      {
        isActive: req.body.isActive == "on",
        actionText: req.body.actionText,
        actionUrl: req.body.actionUrl,
        inApp: req.body.inApp == "on"
      },
      { upsert: true }
    );
    res.redirect("/views/panel/controls".concat(result ? "" : "?err=true"));
  } else {
    res.redirect("/views/panel/login");
  }
};
