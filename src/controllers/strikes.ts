import { RequestHandler } from "express";
import { Strike } from "../models/strikes";


export const getStrikes: RequestHandler = (req, res) => {
  var ogName = req.query.ogName;
  if (ogName == "" || ogName == null) {
    Strike.find({},function(err: Error, strikes) {
      if (err) return console.error(err);
      console.log(strikes);
      res.status(200).json({og: ogName, strikes: strikes});
    });
  } else {
    Strike.find({name: ogName},function(err: Error, strikes) {
      if (err) return console.error(err);
      console.log(strikes);
      res.status(200).json({og: ogName, strikes: strikes});
    });
  }
};
