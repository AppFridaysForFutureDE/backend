import { Router } from "express";
import { getOgs } from "../controllers/ogs";

const router = Router();

router.get("/", getOgs);

export default router;
