import { Router } from "express";
import {
  populateDB,
  saveLiveevent,
  firebaseStatus
} from "../endpoints/controls";
import { getLiveevent, getOGs, getStrikes } from "../endpoints/api";
import { sharePost } from "../endpoints/share";
import { webhookTriggered } from "../endpoints/webhook";

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
