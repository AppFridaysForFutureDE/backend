import { RequestHandler } from "express";
import * as strikeAccess from "../data/strikes";
import * as meetingAccess from "../data/meetings";
import * as ogAccess from "../data/ogs";
import { Liveevent } from "../models/liveeventModel";
import { UserManager } from "../userManager";

export const populateDB: RequestHandler = async (req, res) => {
  let sessID = req.cookies["fff_sessionid"];
  if (!UserManager.getInstance().checkSessionID(sessID)) {
    res.status(401).end();
  }
  await Promise.all([
    ogAccess.retrieveOGs(),
    strikeAccess.retrieveStrikes(),
    meetingAccess.retrieveMeetings()
  ]);
  res.status(200).json({ performedPopulate: true });
};

export const saveLiveevent: RequestHandler = async (req, res) => {
  let sessID = req.cookies["fff_sessionid"];
  if (!UserManager.getInstance().checkSessionID(sessID)) {
    res.status(401).end();
  }
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
  let username = req.body.username;
  let password = req.body.password;
  let { valid, sessionID } = UserManager.getInstance().login(username, password);
  if(!valid) {
    res.redirect("/views/panel/login?err=true");
  }
  res.cookie("fff_sessionid", sessionID);
  res.redirect("/views/panel/controls");
};

export const logout: RequestHandler = async (req, res) => {
  let sessID = req.cookies["fff_sessionid"];
  UserManager.getInstance().logout(sessID);
  res.redirect("/views/panel/login");
};

export const remove: RequestHandler = async (req, res) => {
  let username = req.body.username;
  let sessID = req.cookies["fff_sessionid"];
  let success = UserManager.getInstance().removeUser(username, sessID);
  res.status(200).json({ success: success });
};

export const create: RequestHandler = async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let admin: boolean = req.body.admin;
  let sessID = req.cookies["fff_sessionid"];
  let success = UserManager.getInstance().createUser({username, password, admin}, sessID);
  res.status(200).json({ success: success });
};

export const update: RequestHandler = async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let admin: boolean = req.body.admin;
  let sessID = req.cookies["fff_sessionid"];
  let success = UserManager.getInstance().updateUser({username, password, admin}, sessID);
  res.status(200).json({ success: success });
};
