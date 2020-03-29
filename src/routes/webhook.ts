import { Router } from "express";
import { webhookTriggered } from "../controllers/webhook";

const router = Router();

router.post("/", webhookTriggered);

export default router;
