import { RequestHandler } from "express";
import { FCMAdmin } from "../services/fcm";
import { UserManager } from "../userManager";
import { User } from "../models/userModel";
import Utility from "../utility";

export const loginView: RequestHandler = async (req, res) => {
    //redirect to controls if good session id
    let sessID = req.cookies["fff_sessionid"];
    let { valid, admin } = await UserManager.checkSessionID(sessID);
    if (valid) {
        res.redirect("/views/panel/controls");
    } else if (req.query.err == "true") {
        res.render("login", { err: true })
    } else {
        res.render("login", { err: false });
    }
};

export const controlsView: RequestHandler = async (req, res) => {
    //redirect to login if wrong/missing session id
    let sessID = req.cookies["fff_sessionid"];
    let { valid, admin } = await UserManager.checkSessionID(sessID);
    if (!valid) {
        res.redirect("/views/panel/login");
    } else {

        //gather all the data for serverside rendering
        const status = FCMAdmin.getInstance().getStatus() ? "Verbunden" : "Nicht verbunden";
        let usr = (await User.find({})).map(function (userdoc) {
            return {
                name: userdoc["name"],
                active: (userdoc["activeSession"] != "" && userdoc["activeSession"] != undefined && Utility.toUnixTimestamp(new Date()) < userdoc["expiration"]),
                rights: userdoc["admin"] ? "Administrator" : "Developer"
            };
        });

        //render
        res.render("controls", {
            firebaseStatus: status,
            admin: admin,
            users: usr
        });
    }
};
