import { Router } from "express";
import {
  login,
  logout,
  create,
  changePassword,
  remove,
  makeAdmin
} from "../endpoints/user";
import {
  populateDB,
  saveLiveevent
} from "../endpoints/actions"
import { getLiveevent, getOGs, getStrikes } from "../endpoints/api";
import { sharePost } from "../endpoints/share";
import { loginView, controlsView } from "../endpoints/views";
import { webhookTriggered } from "../endpoints/webhook";

export const controlsRoutes = Router();
export const liveeventRoutes = Router();
export const ogRoutes = Router();
export const shareRoutes = Router();
export const strikeRoutes = Router();
export const webhookRoutes = Router();
export const viewRoutes = Router();

controlsRoutes.post("/action/populateDB", populateDB);
controlsRoutes.post("/action/liveevent", saveLiveevent);
controlsRoutes.post("/user/login", login);
controlsRoutes.post("/user/logout", logout);
controlsRoutes.post("/user/create", create);
controlsRoutes.post("/user/changePassword", changePassword);
controlsRoutes.post("/user/remove", remove);
controlsRoutes.post("/user/makeAdmin", makeAdmin);

liveeventRoutes.get("/", getLiveevent);

ogRoutes.get("/", getOGs);

shareRoutes.get("/:post", sharePost);

strikeRoutes.get("/", getStrikes);

webhookRoutes.post("/", webhookTriggered);

viewRoutes.get("/panel/login", loginView);
viewRoutes.get("/panel/controls", controlsView);
