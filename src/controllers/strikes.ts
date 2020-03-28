import { RequestHandler } from "express";
import { Strike } from "../models/strikes";

export const getStrikes: RequestHandler = (req, res) => {
  const ogName = req.query.og;
  if (ogName == "" || ogName == null) {
    console.log(res.constructor.name);
    res.status(400).json({ error: "No OG specified!" });
  } else {
    Strike.find({ name: ogName }, function(err: Error, strikes) {
      if (err) return console.error(err);
      console.log(strikes);
      res.status(200).json({ og: ogName, strikes: strikes });
    });
  }
};
