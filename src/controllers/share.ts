import { RequestHandler } from "express";

export const sharePost: RequestHandler = (req, res) => {
  res.status(200).json({ post: req.params.post });
};
