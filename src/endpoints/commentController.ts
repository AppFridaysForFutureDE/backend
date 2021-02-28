import { RequestHandler } from "express";
import { Comment } from "../models/commentModel";

export const createComment: RequestHandler = async (req, res) => {
  try {
    console.log("saving comment");
    await Comment.create({
      name: req.body.name,
      age: req.body.age,
      content: req.body.content,
      publish: req.body.publish,
      articleReference: req.body.articleReference,
    });

    // TODO: redirect to new success page
    /* res.redirect("/views/panel/controls"); */
    res.send(200);
  } catch (e) {
    console.log(`Error while saving comment ${e}`);
    res.send(442);
  }
};
