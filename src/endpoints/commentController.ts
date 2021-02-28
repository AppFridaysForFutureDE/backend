import { RequestHandler } from "express";
import { Comment } from "../models/commentModel";

export const createComment: RequestHandler = async (req, res) => {
  try {
    console.log("saving comment");
    await Comment.create({
      name: req.body.name,
      age: req.body.age,
      content: req.body.content,
      publish: req.body.publish || false,
      articleReference: req.body.articleReference,
    });

    // TODO: redirect to new success page
    res.send("Vielen Dank, wir haben deinen Leserbrief erhalten.");
  } catch (e) {
    console.log(`Error while saving comment ${e}`);
    res.sendStatus(442);
  }
};
