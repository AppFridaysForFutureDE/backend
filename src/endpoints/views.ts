import { RequestHandler } from "express";

export const login: RequestHandler = async (req, res) => {
    res.render("login");
}

export const controls: RequestHandler = async (req, res) => {
    res.render("controls");
}