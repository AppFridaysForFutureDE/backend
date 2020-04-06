import express, { Request, Response } from "express";
import { json } from "body-parser";
import strikeRoutes from "./routes/strikes";
import ogRoutes from "./routes/ogs";
import webhookRoutes from "./routes/webhook";
import Ddos from "ddos";
import expressStatusMonitor from "express-status-monitor";

//------DoS-Protection------
const DoSProtection = new Ddos({ burst: 10, limit: 15 }); //probably need to adjust these

//------Express Server------
//create server, add json encoding and ddos protection
export const app = express();
app.use(json());

//Status Monitor
app.use(expressStatusMonitor({ path: "/internal/status" }));

//initialise routers; every router needs to use ddos
strikeRoutes.use(DoSProtection.express);
ogRoutes.use(DoSProtection.express);
app.use("/api/v1/strikes", strikeRoutes);
app.use("/api/v1/ogs", ogRoutes);
app.use("/internal/webhooks/ghost", webhookRoutes);

app.use(function(err: Error, req: Request, res: Response, next) {
  res.status(500).json({ message: err.message });
});
