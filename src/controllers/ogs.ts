import { RequestHandler } from "express";
import { OG } from "../models/ogs";

export const getOGs: RequestHandler = (req, res) => {
  const ogId = req.query.ogId;
  if (ogId == "" || ogId == null) {
    OG.find({}, function(err: Error, ogs) {
      if (err) return console.error(err);
      res.status(200).json({ count: ogs.length, ogs: ogs });
    });
  } else {
    OG.find({ ogId: ogId }, function(err: Error, ogs) {
      if (err) return console.error(err);
      res.status(200).json({ count: ogs.length, ogs: ogs });
    });
  }
};
