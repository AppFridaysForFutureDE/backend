import { RequestHandler } from "express";
import { Comment } from "../models/commentModel";

export const createComment: RequestHandler = async (req, res) => {
  const success = await Comment.create({
    name: req.body.name,
    age: req.body.age,
    content: req.body.content,
    publish: req.body.publish,
    articleReference: req.body.articleReference,
  });
  // TODO: redirect to new success page
  res.redirect("/views/panel/controls".concat(success ? "" : "?err=true"));
};
