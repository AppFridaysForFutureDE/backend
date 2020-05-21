import { RequestHandler } from "express";
import { OG } from "../models/ogs";

export const getLiveevent: RequestHandler = (req, res) => {
  res.status(200).json({ getLiveticker: "Hello" });
};
