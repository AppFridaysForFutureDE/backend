import { RequestHandler } from "express";
import { messageAdmin } from "../app";

export const webhookTriggered: RequestHandler = (req, res) => {
  console.log("Webhook Ghost triggered");
  var data = req.body;
  var title = data["post"]["current"]["title"];
  var id = data["post"]["current"]["id"];
  var tags = data["post"]["current"]["tags"];
  var topic = ""; var push = false; var i = 0;
  for (i = 0; i < tags.length; i++) {
    if (tags[i]["description"] == "Themenbereich") {
      topic = tags[i]["name"];
    }
    if (tags[i]["name"] == "Push") {
      push = true;
    }
  }
  if (push) {
    messageAdmin.sendMessage("feed_"+topic,id,"Neuer Post!","Hey, gerade wurde \""+title+"\" in der Kategorie \"" + topic + "\" veröffentlicht!");
  }
  res.status(200).json({ notifSent: push });
};
