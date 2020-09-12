import { RequestHandler } from "express";
import * as strikeAccess from "../data/strikes";
import * as meetingAccess from "../data/meetings";
import * as ogAccess from "../data/ogs";
import { Liveevent } from "../models/liveeventModel";
import { Slogan } from "../models/sloganModel";

export const populateDB: RequestHandler = async (req, res) => {
  if (!req.auth.valid) {
    res.status(200).json({ performedPopulate: false });
    return;
  }
  await Promise.all([
    ogAccess.retrieveOGs(),
    strikeAccess.retrieveStrikes(),
    meetingAccess.retrieveMeetings()
  ]);
  res.status(200).json({ performedPopulate: true });
};

export const saveLiveevent: RequestHandler = async (req, res) => {
  if (!req.auth.valid) {
    res.redirect("/views/panel/login");
    return;
  }
  const result = await Liveevent.findOneAndUpdate(
    { liveeventId: req.body.id },
    {
      isActive: req.body.isActive == "on",
      actionText: req.body.actionText || "",
      actionUrl: req.body.actionUrl || "",
      inApp: req.body.inApp == "on"
    },
    { upsert: true }
  );
  res.redirect("/views/panel/controls".concat(result ? "" : "?err=true"));
};

export const addSlogan: RequestHandler = async (req, res) => {
  if (!req.auth.valid) {
    res.redirect("/views/panel/login");
    return;
  }
  let tags = (req.body.tags || "").split(",").map(t => {
    return t.trim();
  });
  tags = tags.filter(t => {
    return t != "" && t != null;
  });
  const result = await Slogan.create({
    text: req.body.text || "",
    tags: tags
  });
  res.redirect("/views/panel/controls".concat(result ? "" : "?err=true"));
};

export const deleteSlogan: RequestHandler = async (req, res) => {
  if (!req.auth.valid) {
    res.redirect("/views/panel/login");
    return;
  }
  const result = await Slogan.findByIdAndDelete(req.body.id || "");
  res.redirect("/views/panel/controls".concat(result ? "" : "?err=true"));
};

export const editSlogan: RequestHandler = async (req, res) => {
  if (!req.auth.valid) {
    res.redirect("/views/panel/login");
    return;
  }
  let tags = (req.body.tags || "").split(",").map(t => {
    return t.trim();
  });
  tags = tags.filter(t => {
    return t != "" && t != null;
  });
  const result = await Slogan.findByIdAndUpdate(req.body.id || "", {
    text: req.body.text || "",
    tags: tags
  });
  res.redirect("/views/panel/controls".concat(result ? "" : "?err=true"));
};
