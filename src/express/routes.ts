import express, { Router } from "express";
import {
  login,
  logout,
  create,
  changePassword,
  remove,
  makeAdmin,
} from "../endpoints/user";
import {
  populateDB,
  saveLiveevent,
  addSlogan,
  deleteSlogan,
  editSlogan,
  addCampaign,
  editCampaign,
  deleteCampaign,
  addBanner,
  deleteBanner,
  editBanner,
  addFeedItem,
  editFeedItem,
  deleteFeedItem,
} from "../endpoints/actions";
import {
  getLiveevent,
  getOGs,
  getStrikes,
  getSlogans,
  getHomefeed,
  getCampaigns,
} from "../endpoints/api";
import { sharePost } from "../endpoints/share";
import { loginView, controlsView } from "../endpoints/views";
import { webhookTriggered } from "../endpoints/webhook";

export const controlsRoutes = Router();
export const apiRoutes = Router();
export const shareRoutes = Router();
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

controlsRoutes.post("/slogans/add", addSlogan);
controlsRoutes.post("/slogans/edit", editSlogan);
controlsRoutes.post("/slogans/remove", deleteSlogan);

controlsRoutes.post("/campaigns/add", addCampaign);
controlsRoutes.post("/campaigns/edit", editCampaign);
controlsRoutes.post("/campaigns/remove", deleteCampaign);

controlsRoutes.post("/banner/add", addBanner);
controlsRoutes.post("/banner/edit", editBanner);
controlsRoutes.post("/banner/remove", deleteBanner);

controlsRoutes.post("/feed/add", addFeedItem);
controlsRoutes.post("/feed/edit", editFeedItem);
controlsRoutes.post("/feed/remove", deleteFeedItem);

apiRoutes.use("/*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET");
  next();
});

apiRoutes.get("/liveevent", getLiveevent);
apiRoutes.get("/strikes", getStrikes);
apiRoutes.get("/slogans", getSlogans);
apiRoutes.get("/ogs", getOGs);
apiRoutes.get("/home", getHomefeed);
apiRoutes.get("/campaigns", getCampaigns);
apiRoutes.use("/img", express.static("/var/image-data"));

shareRoutes.get("/:post", sharePost);

webhookRoutes.post("/", webhookTriggered);

viewRoutes.get("/panel/login", loginView);
viewRoutes.get("/panel/controls", controlsView);
