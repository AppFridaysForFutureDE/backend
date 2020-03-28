import { RequestHandler } from "express";
import { Strike } from "../models/strikes";

export const getStrikes: RequestHandler = (req, res) => {
  const ogId = req.query.ogId;
  if (ogId == "" || ogId == null) {
    console.log(res.constructor.name);
    res.status(400).json({ error: "No OG specified!" });
  } else {
    Strike.find({ ogId: ogId }, function(err: Error, strikes) {
      if (err) return console.error(err);
      console.log(strikes);
      res.status(200).json({ ogId: ogId, strikes: strikes });
    });
  }
};
