import { RequestHandler } from "express";
import { Strike } from "../models/strikes";
import * as util from "../utility";

export const getStrikes: RequestHandler = (req, res) => {
  const ogId = req.query.ogId;
  //Setzt mindestdatum für streiks auf 0, wenn anfrage festlegt, dass auch vergangene streiks zurückgegeben werden sollen
  //sonst ist das mindestdatum das aktuelle - 24h => so werden auch erst kürzlich beendete streiks noch angezeigt
  const minDate =
    req.query.showPastStrikes == "true"
      ? 0
      : util.toUnixTimestamp(new Date()) - util.day;

  if (ogId == "" || ogId == null) {
    res.status(400).json({ error: "No OG specified!" });
  } else {
    // TODO: Remove strikeId not equal 866 (hotfix to hide specific strike in app)
    Strike.find(
      { ogId: ogId, date: { $gt: minDate }, strikeId: { $ne: "866" } },
      function(err: Error, strikes) {
        if (err) return console.error(err);
        res.status(200).json({ ogId: ogId, strikes: strikes });
      }
    );
  }
};
