import { RequestHandler } from "express";
import * as strikeAccess from "../api/strikes";
import * as ogAccess from "../api/ogs";

export const firebaseStatus: RequestHandler = (req, res) => {
  console.log("Firebase status requested")
  res.status(501);
};

export const createBackup: RequestHandler = (req, res) => {
  console.log("Firebase status requested")
  res.status(501);
};

export const populateDB: RequestHandler = async (req, res) => {
  console.log("Populating DB");
  await Promise.all([ogAccess.retrieveOGs(), strikeAccess.retrieveStrikes()]);
  res.status(200);
};
