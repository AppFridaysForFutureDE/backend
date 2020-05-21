import { Router } from "express";
import { getLiveevent } from "../controllers/liveevent";

const router = Router();

router.get("/", getLiveevent);

export default router;
