import { RequestHandler } from "express";
import { Liveevent } from "../models/liveeventModel";

export const getLiveevent: RequestHandler = (req, res) => {
  let liveeventId = req.query.liveeventId;
  if (liveeventId == "" || liveeventId == null) {
    liveeventId = 0;
  }
  Liveevent.findOne({ liveeventId: liveeventId }, function(err: Error, event) {
    if (err) return console.error(err);
    res.status(200).json({ liveeventId: liveeventId, liveevent: event });
  });
};
