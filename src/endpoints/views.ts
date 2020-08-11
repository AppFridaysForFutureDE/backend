import { RequestHandler } from "express";
import FCMAdmin from "../services/FCMAdmin";
import { User } from "../models/userModel";
import { Liveevent } from "../models/liveeventModel";
import Utility from "../Utility";
import LogManager from "../LogManager";
import { Slogan } from "../models/sloganModel";

export const loginView: RequestHandler = async (req, res) => {
  //redirect to controls if good session id
  if (req.auth.valid) {
    res.redirect("/views/panel/controls");
  } else {
    res.render("login", { err: req.query.err == "true" });
  }
};

export const controlsView: RequestHandler = async (req, res) => {
  //redirect to login if wrong/missing session id
  if (!req.auth.valid) {
    res.redirect("/views/panel/login");
    return;
  }
  //gather all the data for serverside rendering
  const status = FCMAdmin.getInstance().getStatus();

  const userList = (await User.find({})).map(function (userdoc) {
    return {
      name: userdoc["name"],
      active:
        userdoc["activeSession"] != "" &&
        userdoc["activeSession"] != undefined &&
        Utility.toUnixTimestamp(new Date()) < userdoc["expiration"],
      rights: userdoc["admin"] ? "Administrator" : "App-AG Mitglied",
      admin: userdoc["admin"]
    };
  });

  const le = (await Liveevent.findOne({ liveeventId: 0 })) || {
    actionText: "",
    actionUrl: "",
    inApp: false,
    isActive: false
  };

  const currentUser = {
    name: req.auth.name,
    admin: req.auth.admin,
    rights: req.auth.admin ? "Administrator" : "App-AG Mitglied"
  };

  const logs = await LogManager.readLogs();

  const slogans = (await Slogan.find({})).map(s => {
    return {
      _id: s._id,
      title: s["title"],
      text: s["text"],
      tags: s["tags"],
      tagsText: s["tags"].join(", ")
    };
  });

  //render
  res.render("controls", {
    firebaseStatus: status,
    users: userList,
    currUser: currentUser,
    liveevent: le,
    error: req.query.err == "true",
    logs: logs,
    slogans: slogans
  });
};
