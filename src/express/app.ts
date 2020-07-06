import express, { Request, Response } from "express";
import { json } from "body-parser";
import cookieParser from "cookie-parser";
import expressStatusMonitor from "express-status-monitor";
import path from "path";

//routes
import {
  strikeRoutes,
  ogRoutes,
  webhookRoutes,
  shareRoutes,
  controlsRoutes,
  liveeventRoutes,
  viewRoutes
} from "./routes";

//Initialization
export const app = express();
app.use(json());
app.use(cookieParser());
app.use(express.urlencoded());
app.set("views", path.join(__dirname, "../../src/views"));
app.set("view engine", "ejs");

//API Routes
app.use("/api/v1/strikes", strikeRoutes);
app.use("/api/v1/ogs", ogRoutes);
app.use("/api/v1/liveevent", liveeventRoutes);

//Internal Routes
app.use("/internal/webhooks/ghost", webhookRoutes);

//Public Routes
app.use("/p", shareRoutes);

//Controls Routes
app.use("/admin/controls", controlsRoutes);
app.use(expressStatusMonitor({ path: "/admin/status" }));

//View Routes
app.use("/views", viewRoutes);

app.use(function(err: Error, req: Request, res: Response, next) { // eslint-disable-line
  res.status(500).json({ message: err.message });
});
