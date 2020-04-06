import express, { Request, Response } from "express";
import { json } from "body-parser";
import strikeRoutes from "./routes/strikes";
import ogRoutes from "./routes/ogs";
import webhookRoutes from "./routes/webhook";
import Ddos from "ddos";
import expressStatusMonitor from "express-status-monitor";

//our hoster also has ddos protection
//maybe we do not need it here?
//
//probably need to adjust ddos params burst and limit
const DoSProtection = new Ddos({ burst: 10, limit: 15 });

//initialise routers; every router needs to use ddos
strikeRoutes.use(DoSProtection.express);
ogRoutes.use(DoSProtection.express);

export const app = express();
app.use(json());
app.use("/api/v1/strikes", strikeRoutes);
app.use("/api/v1/ogs", ogRoutes);
app.use("/internal/webhooks/ghost", webhookRoutes);
app.use(expressStatusMonitor({ path: "/internal/status" }));

app.use(function(err: Error, req: Request, res: Response, next) {
  res.status(500).json({ message: err.message });
});
