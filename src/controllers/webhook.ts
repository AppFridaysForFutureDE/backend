import { RequestHandler } from "express";

export const webhookTriggered: RequestHandler = (req, res) => {
  console.log(req.body);
  res.status(200).json({ ok: "ok" });
};
