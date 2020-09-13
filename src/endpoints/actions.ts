import { RequestHandler } from "express";
import * as strikeAccess from "../data/strikes";
import * as meetingAccess from "../data/meetings";
import * as ogAccess from "../data/ogs";
import { Liveevent } from "../models/liveeventModel";
import { Slogan } from "../models/sloganModel";
import { Banner } from "../models/bannersModel";
import { Campaign } from "../models/campaignsModel";

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

//Slogans
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

//Campaigns
export const addCampaign: RequestHandler = async (req, res) => {
  if (!req.auth.valid) {
    res.redirect("/views/panel/login");
    return;
  }
  const result = await Campaign.create({
    name: req.body.name || "",
    icon: req.body.icon || "",
    text: req.body.text || "",
    cta: req.body.cta || "",
    link: req.body.link || "",
    inApp: req.body.inApp == "on",
    active: req.body.active == "on"
  });
  res.redirect("/views/panel/controls".concat(result ? "" : "?err=true"));
};

export const deleteCampaign: RequestHandler = async (req, res) => {
  if (!req.auth.valid) {
    res.redirect("/views/panel/login");
    return;
  }
  const result = await Campaign.findByIdAndDelete(req.body.id || "");
  res.redirect("/views/panel/controls".concat(result ? "" : "?err=true"));
};

export const editCampaign: RequestHandler = async (req, res) => {
  if (!req.auth.valid) {
    res.redirect("/views/panel/login");
    return;
  }
  const result = await Campaign.findByIdAndUpdate(req.body.id || "", {
    name: req.body.name || "",
    icon: req.body.icon || "",
    text: req.body.text || "",
    cta: req.body.cta || "",
    link: req.body.link || "",
    inApp: req.body.inApp == "on",
    active: req.body.active == "on"
  });
  res.redirect("/views/panel/controls".concat(result ? "" : "?err=true"));
};

//Banner
export const saveBanner: RequestHandler = async (req, res) => {
  if (!req.auth.valid) {
    res.redirect("/views/panel/login");
    return;
  }
  const result = await Liveevent.findOneAndUpdate(
    { liveeventId: req.body.id },
    {
      active: req.body.active == "on",
      link: req.body.link || "",
      imageUrl: req.body.imageUrl || "",
      inApp: req.body.inApp == "on"
    },
    { upsert: true }
  );
  res.redirect("/views/panel/controls".concat(result ? "" : "?err=true"));
};