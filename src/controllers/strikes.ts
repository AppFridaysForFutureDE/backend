import { RequestHandler } from "express";
import { Strike } from "../models/strikes";

export const getStrikes: RequestHandler = (req, res) => {
  const ogId = req.query.ogId;
  if (ogId == "" || ogId == null) {
    Strike.find({  }, function(err: Error, strikes) {
      if (err) return console.error(err);
      res.status(200).json({ ogId: ogId, strikes: strikes });
    });
  } else {
    Strike.find({ ogId: ogId }, function(err: Error, strikes) {
      if (err) return console.error(err);
      res.status(200).json({ ogId: ogId, strikes: strikes });
    });
  }
};
