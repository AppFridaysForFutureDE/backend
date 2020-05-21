import express, { Request, Response } from "express";
import { json } from "body-parser";
import expressStatusMonitor from "express-status-monitor";

//routes
import strikeRoutes from "./routes/strikes";
import ogRoutes from "./routes/ogs";
import webhookRoutes from "./routes/webhook";
import shareRoutes from "./routes/share";
import controlRoutes from "./routes/controls";
import liveeventRoutes from "./routes/liveevent";

//Initialization
export const app = express();
app.use(json());

//API Routes
app.use("/api/v1/strikes", strikeRoutes);
app.use("/api/v1/ogs", ogRoutes);
app.use("/api/v1/liveevent", liveeventRoutes);

//Internal Routes
app.use("/internal/webhooks/ghost", webhookRoutes);

//Public Routes
app.use("/p", shareRoutes);

//Admin Routes
app.use("/admin/controls", controlRoutes);
app.use(expressStatusMonitor({ path: "/admin/status" }));

app.use(function(err: Error, req: Request, res: Response, next) {
  res.status(500).json({ message: err.message });
});
