import { RequestHandler } from "express";
import * as strikeAccess from "../data/strikes";
import * as meetingAccess from "../data/meetings";
import * as ogAccess from "../data/ogs";
import { Liveevent } from "../models/liveeventModel";
import { UserManager } from "../userManager";

//___________________
//| User Management |
//|_________________|
export const login: RequestHandler = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const { valid, sessionID } = await UserManager.login(username, password);
  if (valid) {
    res.cookie("fff_sessionid", sessionID);
    res.redirect("/views/panel/controls");
  } else {
    res.redirect("/views/panel/login?err=true");
  }
};

export const logout: RequestHandler = async (req, res) => {
  await UserManager.logout(req.auth.session);
  res.redirect("/views/panel/controls");
};

export const remove: RequestHandler = async (req, res) => {
  const username = req.body.username;
  if (req.auth.admin) {
    const success = await UserManager.removeUser(username);
    res.redirect("/views/panel/controls".concat(success ? "" : "?err=true"));
  } else {
    res.redirect("/views/panel/login");
  }
};

export const create: RequestHandler = async (req, res) => {
  const username = req.body.username;
  const admin: boolean = req.body.admin == "Administrator";
  if (req.auth.admin) {
    const success = await UserManager.createUser({ username, admin });
    res.redirect("/views/panel/controls".concat(success ? "" : "?err=true"));
  } else {
    res.redirect("/views/panel/login");
  }
};

export const changePassword: RequestHandler = async (req, res) => {
  const passwordNew = req.body.password;
  if (req.auth.valid) {
    const success = await UserManager.changePassword(
      req.auth.name,
      passwordNew
    );
    if (success) {
      await UserManager.logout(req.auth.session);
    }
    res.redirect("/views/panel/controls".concat(success ? "" : "?err=true"));
  } else {
    res.redirect("/views/panel/login");
  }
};

export const makeAdmin: RequestHandler = async (req, res) => {
  const username = req.body.username;
  if (req.auth.admin) {
    const success = await UserManager.makeAdmin(username);
    res.redirect("/views/panel/controls".concat(success ? "" : "?err=true"));
  } else {
    res.redirect("/views/panel/login");
  }
};

//___________
//| Actions |
//|_________|

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
