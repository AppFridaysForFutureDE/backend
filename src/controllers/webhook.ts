import { RequestHandler } from "express";
import FCMAdmin from "./fcm";
const messageAdmin = new FCMAdmin("../src/auth/de-fridaysforfuture-app-firebase-adminsdk-98yw1-c45342f3dc.json");

export const webhookTriggered: RequestHandler = (req, res) => {
  console.log("Webhook triggered");
  var data = req.body();
  var title = data["post"]["current"]["title"];
  var tag = data["post"]["current"]["primary_tag"];
  var id = data["post"]["current"]["id"]
  messageAdmin.sendMessage("feed_"+tag,id,"Neuer Artikel!","Hey, gerade wurde \""+title+"\" in der Kategorie " + tag + " veröffentlicht!")
  res.status(200).json({ ok: "ok" });
};
