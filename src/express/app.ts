import express, { Request, Response } from "express";
import { json } from "body-parser";
import expressStatusMonitor from "express-status-monitor";

//routes
import { strikeRoutes } from "./routes";
import { ogRoutes } from "./routes";
import { webhookRoutes } from "./routes";
import { shareRoutes } from "./routes";
import { controlsRoutes } from "./routes";
import { liveeventRoutes } from "./routes";

//Initialization
export const app = express();
app.use(json());
app.use(express.urlencoded());

//API Routes
app.use("/api/v1/strikes", strikeRoutes);
app.use("/api/v1/ogs", ogRoutes);
app.use("/api/v1/liveevent", liveeventRoutes);

//Internal Routes
app.use("/internal/webhooks/ghost", webhookRoutes);

//Public Routes
app.use("/p", shareRoutes);

//Admin Routes
app.use("/admin/controls", controlsRoutes);
app.use(expressStatusMonitor({ path: "/admin/status" }));

app.use(function(err: Error, req: Request, res: Response, next) { // eslint-disable-line
  res.status(500).json({ message: err.message });
});
