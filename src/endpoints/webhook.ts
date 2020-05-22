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

  tags.array.forEach(tag => {
    if (tag["description"] == "Themenbereich") {
      topic = tag["name"];
    }
    if (tag["name"] == "Push") {
      push = true;
    }
  });
  
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
