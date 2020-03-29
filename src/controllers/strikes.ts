import { RequestHandler } from "express";
import { Strike } from "../models/strikes";

export const getStrikes: RequestHandler = (req, res) => {
  const ogId = req.query.ogId;
  if (ogId == "" || ogId == null) {
    res.status(400).json({ error: "No OG specified!" });
  } else {
    Strike.find({ ogId: ogId }, function(err: Error, strikes) {
      if (err) return console.error(err);
      res.status(200).json({ ogId: ogId, strikes: strikes });
    });
  }
};
