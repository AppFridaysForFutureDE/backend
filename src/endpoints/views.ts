import { RequestHandler } from "express";
import { FCMAdmin } from "../services/fcm";
import { User } from "../models/userModel";
import Utility from "../utility";

export const loginView: RequestHandler = async (req, res) => {
  //redirect to controls if good session id
  if (req.auth.valid) {
    res.redirect("/views/panel/controls");
  } else {
    res.render("login", { err: (req.query.err == "true") });
  }
};

export const controlsView: RequestHandler = async (req, res) => {
  //redirect to login if wrong/missing session id
  if (!req.auth.valid) {
    res.status(401).end();
  } else {
    //gather all the data for serverside rendering
    const status = FCMAdmin.getInstance().getStatus()
      ? "Verbunden"
      : "Nicht verbunden";
    const userList = (await User.find({})).map(function(userdoc) {
      return {
        name: userdoc["name"],
        active:
          userdoc["activeSession"] != "" &&
          userdoc["activeSession"] != undefined &&
          Utility.toUnixTimestamp(new Date()) < userdoc["expiration"],
        rights: userdoc["admin"] ? "Administrator" : "Developer",
        admin: userdoc["admin"]
      };
    });

    //TODO: Refactor
    const currentUser = (await User.find({ activeSession: req.auth.session })).map(function(userdoc) {
      return {
        name: userdoc["name"],
        admin: userdoc["admin"],
        rights: userdoc["admin"] ? "Administrator" : "Developer"
      };
    })[0];

    //render
    res.render("controls", {
      firebaseStatus: status,
      users: userList,
      currUser: currentUser
    });
  }
};
