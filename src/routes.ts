import { Router } from "express";
import { firebaseStatus } from "./controllers/controls";
import { populateDB } from "./controllers/controls";
import { saveLiveevent } from "./controllers/controls";
import { getLiveevent } from "./controllers/liveevent";
import { getOGs } from "./controllers/ogs";
import { sharePost } from "./controllers/share";
import { getStrikes } from "./controllers/strikes";
import { webhookTriggered } from "./controllers/webhook";

export const controlsRoutes = Router();
export const liveeventRoutes = Router();
export const ogRoutes = Router();
export const shareRoutes = Router();
export const strikeRoutes = Router();
export const webhookRoutes = Router();

controlsRoutes.get("/firebaseStatus", firebaseStatus);
controlsRoutes.post("/populateDB", populateDB);
controlsRoutes.post("/liveevent", saveLiveevent);

liveeventRoutes.get("/", getLiveevent);

ogRoutes.get("/", getOGs);

shareRoutes.get("/:post", sharePost);

strikeRoutes.get("/", getStrikes);

webhookRoutes.post("/", webhookTriggered);