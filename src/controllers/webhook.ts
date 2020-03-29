import { RequestHandler } from "express";
import { messageAdmin } from "../app";
export const webhookTriggered: RequestHandler = (req, res) => {
  console.log("Webhook Ghost triggered");
  console.log(req.body);
  var data = req.body;
  var title = data["post"]["current"]["title"];
  var tag = data["post"]["current"]["primary_tag"]["name"];
  var id = data["post"]["current"]["id"];
  console.log(title + " " + tag + " " + id);
  messageAdmin.sendMessage("feed_"+tag,id,"Neuer Artikel!","Hey, gerade wurde \""+title+"\" in der Kategorie " + tag + " veröffentlicht!")
  res.status(200).json({ ok: "ok" });
};
