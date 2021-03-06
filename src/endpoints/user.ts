import { RequestHandler } from "express";
import UserManager from "../UserManager";
import { User } from "../models/userModel";

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
  res.redirect("/views/panel/login");
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
    const success = await User.create({ name: username, admin: admin });
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
