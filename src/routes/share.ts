import { Router } from "express";
import { sharePost } from "../controllers/share";

const router = Router();

router.get("/:post", sharePost);

export default router;
