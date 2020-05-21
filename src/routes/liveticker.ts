import { Router } from "express";
import { getLiveticker } from "../controllers/liveticker";

const router = Router();

router.get("/", getLiveticker);

export default router;
