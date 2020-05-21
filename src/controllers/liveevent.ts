import { RequestHandler } from "express";
import { Liveevent } from "../models/liveevent";

export const getLiveevent: RequestHandler = (req, res) => {
  const id = req.query.liveeventId;
  Liveevent.find({ liveeventId: id}, function (err: Error, event) {
    res.status(200).json({ liveevent: event });
  })
};