import express, { Request, Response } from "express";
import { json } from "body-parser";
import strikeRoutes from "./routes/strikes";
import ogRoutes from "./routes/ogs";
import webhookRoutes from "./routes/webhook";
import expressStatusMonitor from "express-status-monitor";

import * as strikeAccess from "./api/strikes";
import * as ogAccess from "./api/ogs";

export const app = express();
app.use(json());
app.use("/api/v1/strikes", strikeRoutes);
app.use("/api/v1/ogs", ogRoutes);
app.use("/internal/webhooks/ghost", webhookRoutes);
app.use(expressStatusMonitor({ path: "/internal/status" }));

console.log("Retrieving Strikes");
strikeAccess.retrieveStrikes();

app.use(function(err: Error, req: Request, res: Response, next) {
  res.status(500).json({ message: err.message });
});
