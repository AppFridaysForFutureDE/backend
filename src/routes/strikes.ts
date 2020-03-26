import { Router } from "express";
import { getStrikes } from "../controllers/strikes";

const router = Router();

router.get("/", getStrikes);

export default router;
