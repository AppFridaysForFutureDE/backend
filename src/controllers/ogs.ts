import { RequestHandler } from "express";
import { Og } from "../models/ogs";

export const getOgs: RequestHandler = (req, res) => {
  const ogName = req.query.og;
  if (ogName == "" || ogName == null) {
    Og.find({}, function(err: Error, ogs) {
      if (err) return console.error(err);
      console.log(ogs);
      res.status(200).json({ count: ogs.length, ogs: ogs });
    });
  } else {
    Og.find({ name: ogName }, function(err: Error, ogs) {
      if (err) return console.error(err);
      console.log(ogs);
      res.status(200).json({ count: ogs.length, ogs: ogs });
    });
  }
};