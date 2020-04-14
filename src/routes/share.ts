import { Router } from "express";
import { sharePost } from "../controllers/share";

const router = Router();

router.get("/p/:post", sharePost);

export default router;
