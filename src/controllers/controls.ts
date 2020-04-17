import { RequestHandler } from "express";

export const firebaseStatus: RequestHandler = (req, res) => {
  console.log("Firebase status requested")
  res.status(501);
};

export const createBackup: RequestHandler = (req, res) => {
  console.log("Firebase status requested")
  res.status(501);
};

export const populateDB: RequestHandler = (req, res) => {
  console.log("Firebase status requested")
  res.status(501);
};
