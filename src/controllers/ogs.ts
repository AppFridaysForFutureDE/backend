import { RequestHandler } from "express";
import { Og } from "../models/ogs";

export const getOgs: RequestHandler = (req, res) => {
  const ogId = req.query.ogId;
  if (ogId == "" || ogId == null) {
    Og.find({}, function(err: Error, ogs) {
      if (err) return console.error(err);
      res.status(200).json({ count: ogs.length, ogs: ogs });
    });
  } else {
    Og.find({ ogId: ogId }, function(err: Error, ogs) {
      if (err) return console.error(err);
      res.status(200).json({ count: ogs.length, ogs: ogs });
    });
  }
};
