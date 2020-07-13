import express, { Request, Response } from "express";
import { json } from "body-parser";
import cookieParser from "cookie-parser";
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
import { UserManager } from "../userManager";

//Initialization
export const app = express();
app.use(json());
app.use(cookieParser());
app.use(express.urlencoded());
app.set("views", path.join(__dirname, "../../src/views"));
app.set("view engine", "ejs");

//Auth properties
app.use(async function(req: Request, res: Response, next) {
  let { valid, admin, name } = await UserManager.checkSessionID(req.cookies["fff_sessionid"]);
  req.auth = {
    valid: valid,
    admin: admin,
    name: name,
    session: req.cookies["fff_sessionid"]
  };
  next();
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

//Error Fallback
app.use(function(err: Error, req: Request, res: Response, next) {
  console.log("custom error middleware triggered");
  if (res.statusCode == 401) {
    res.redirect("/views/panel/login");
  } else {
    res.status(500).json({ message: err.message });
  }
});


