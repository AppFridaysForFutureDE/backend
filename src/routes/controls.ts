import { Router } from "express";
import { firebaseStatus } from "../controllers/controls";
import { populateDB } from "../controllers/controls";

const router = Router();

router.get("/firebaseStatus", firebaseStatus);
router.post("/populateDB", populateDB);

export default router;
