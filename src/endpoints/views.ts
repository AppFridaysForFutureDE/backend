import { RequestHandler } from "express";
import { FCMAdmin } from "../services/fcm";

export const loginView: RequestHandler = async (req, res) => {
    //redirect to controls if good session id
    console.log("login page");
    res.render("login");
}

export const controlsView: RequestHandler = async (req, res) => {
    //redirect to login if wrong/missing session id
    console.log("controls page");
    var status = FCMAdmin.getInstance().getStatus();
    console.log(status);
    res.render("controls", {
        firebaseStatus: status,
        admin: false
    });
}