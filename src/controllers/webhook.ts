import { RequestHandler } from "express";
import { FCMAdmin } from "../services/fcm";

export const webhookTriggered: RequestHandler = (req, res) => {
  console.log("Webhook Ghost triggered");
  const data = req.body;
  const title = data["post"]["current"]["title"];
  const id = data["post"]["current"]["id"];
  const tags = data["post"]["current"]["tags"];
  let topic = "";
  let push = false;
  //TODO: foreach
  let i = 0;
  for (i = 0; i < tags.length; i++) {
    if (tags[i]["description"] == "Themenbereich") {
      topic = tags[i]["name"];
    }
    if (tags[i]["name"] == "Push") {
      push = true;
    }
  }
  //TODO: String Templates
  if (push) {
    FCMAdmin.getInstance().sendMessage(
      "feed_" + topic,
      "Neuer Post!",
      'Hey, gerade wurde "' +
        title +
        '" in der Kategorie "' +
        topic +
        '" veröffentlicht!',
      "feed",
      id
    );
  }
  res.status(200).json({ notifSent: push });
};
