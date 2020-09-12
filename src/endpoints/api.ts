import { RequestHandler } from "express";
import { OG } from "../models/ogsModel";
import { Liveevent } from "../models/liveeventModel";
import { Strike } from "../models/strikesModel";
import { Banner } from "../models/bannersModel";
import { Campaign } from "../models/campaignsModel";
import { Slogan } from "../models/sloganModel";
import Utility from "../Utility";

export const getOGs: RequestHandler = (req, res) => {
  const ogId = req.query.ogId;
  if (ogId == "" || ogId == null) {
    OG.find({}, function(err: Error, ogs) {
      if (err) return console.error(err);
      res.status(200).json({ count: ogs.length, ogs: ogs });
    });
  } else {
    OG.find({ ogId: ogId }, function(err: Error, ogs) {
      if (err) return console.error(err);
      res.status(200).json({ count: ogs.length, ogs: ogs });
    });
  }
};

export const getLiveevent: RequestHandler = (req, res) => {
  let liveeventId = req.query.liveeventId || "";
  if (liveeventId == "" || liveeventId == null) {
    liveeventId = 0;
  }
  Liveevent.findOne({ liveeventId: liveeventId }, function(err: Error, event) {
    if (err) return console.error(err);
    res.status(200).json({ liveeventId: liveeventId, liveevent: event });
  });
};

export const getStrikes: RequestHandler = (req, res) => {
  const ogId = req.query.ogId;
  //Setzt mindestdatum für streiks auf 0, wenn anfrage festlegt, dass auch vergangene streiks zurückgegeben werden sollen
  //sonst ist das mindestdatum das aktuelle - 24h => so werden auch erst kürzlich beendete streiks noch angezeigt
  const minDate =
    req.query.showPastStrikes == "true"
      ? 0
      : Utility.toUnixTimestamp(new Date()) - Utility.Day;

  if (ogId == "" || ogId == null) {
    res.status(400).json({ error: "No OG specified!" });
  } else {
    Strike.find(
      { ogId: ogId, date: { $gt: minDate }, strikeId: { $ne: "866" } },
      function(err: Error, strikes) {
        if (err) return console.error(err);
        res.status(200).json({ ogId: ogId, strikes: strikes });
      }
    );
  }
};

<<<<<<< HEAD
export const getCampaigns: RequestHandler = async (req, res) => {
  try {
    const banners = await Banner.find({ active: true })
    const campaigns = await Campaign.find({ active: true })
    banners.sort((a,b) => a["sortOrder"] - b["sortOrder"])
    campaigns.sort((a,b) => a["sortOrder"] - b["sortOrder"])
    banners.map((doc) => {
      return {
        imageUrl: doc["imageUrl"],
        link: doc["link"],
        inApp: doc["inApp"],
      }
    })
    campaigns.map((doc) => {
      return {
        icon: doc["icon"],
        text: doc["text"],
        cta: doc["cta"],
        link: doc["link"],
        inApp: doc["inApp"],
      }
    })
    res.status(200).json({ banners: banners, campaigns: campaigns });
  } catch (err) {
    console.error(err);
  }
};
=======
export const getSlogans: RequestHandler = async (req, res) => {
  try {
    const rawSlogans = await Slogan.find({});

    const slogans = rawSlogans.map(slogan => {
      return { id: slogan._id, text: slogan["text"], tags: slogan["tags"] };
    });
    res.status(200).json({ slogans: slogans });
  } catch (err) {
    return console.error(err);
  }
};
>>>>>>> 76a0289f6cafcfee36b621893fadc2f2b625938a
