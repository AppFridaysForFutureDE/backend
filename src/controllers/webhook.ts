import { RequestHandler } from "express";

export const webhookTriggered: RequestHandler = (req, res) => {
  console.log("Webhook triggered");
  res.status(200).json({ ok: "ok" });
};
