import { Router } from "express";
import { getOGs } from "../controllers/ogs";

const router = Router();

router.get("/", getOGs);

export default router;
