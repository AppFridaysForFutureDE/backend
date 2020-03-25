import { RequestHandler } from "express";
import { Strike } from "../models/strikes";

/*
export const createOg: RequestHandler = async (req, res) => {
  try {
    const newOg = await new Og(req.body).save();


    res.status(201).json({ message: "Created og", createdOg: newOg });
  } catch (error) {
    res.status(422).json({ message: "Could not create og", error: error });
  }
};
*/

export const getStrikes: RequestHandler = (req, res) => {
  var ogName = req.query.ogName;
  //res.status(200).json({og: ogName});
  if (ogName == "" || ogName == null) {
    res.status(400).json({error: "No OG Name specified!"});
  } else {
    Strike.find({name: ogName},function(err: Error, strikes) {
      if (err) return console.error(err);
      console.log(strikes);
      res.status(200).json({og: ogName, strikes: strikes});
    });
  }
};
