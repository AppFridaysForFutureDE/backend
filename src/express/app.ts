import express, { Request, Response } from "express";
import { json } from "body-parser";
import cookieParser from "cookie-parser";
import path from "path";
import UserManager from "../UserManager";

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
import LogManager from "../LogManager";

//Initialization
export const app = express();
app.use(json());
app.use(cookieParser());
app.use(express.urlencoded());
app.set("views", path.join(__dirname, "../../src/views"));
app.set("view engine", "ejs");

//Auth properties & logs
app.use(async function(req: Request, res: Response, next) {
  //check authorization and add auth properties to request
  const { valid, admin, name } = await UserManager.checkSessionID(
    req.cookies["fff_sessionid"]
  );
  req.auth = {
    valid: valid,
    admin: admin,
    name: name,
    session: req.cookies["fff_sessionid"]
  };
  next();

  //if this is an authorized user, log everything they do
  if (req.auth.valid) {
    LogManager.log(req.auth.name, req.method, req.url);
  }
});

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

//View Routes
app.use("/views", viewRoutes);

//Express Error Fallback
app.use(function(err: Error, req: Request, res: Response, next) {
  res.status(500).json({ message: err.message });
});
