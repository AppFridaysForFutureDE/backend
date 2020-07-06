import { RequestHandler } from "express";
import { FCMAdmin } from "../services/fcm";
import { UserManager } from "../userManager";

export const loginView: RequestHandler = async (req, res) => {
    //redirect to controls if good session id
    let sessID = req.cookies["fff_sessionid"];
    let { valid, admin } = UserManager.checkSessionID(sessID);
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
    let { valid, admin } = UserManager.checkSessionID(sessID);
    if (!valid) {
        res.redirect("/views/panel/login");
    } else {
        const status = FCMAdmin.getInstance().getStatus();
        console.log(status);
        res.render("controls", {
            firebaseStatus: status ? "Verbunden" : "Nicht verbunden",
            admin: admin
        });
    }
};
