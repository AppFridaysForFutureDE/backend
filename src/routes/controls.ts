import { Router } from "express";
import { firebaseStatus } from "../controllers/controls";
import { populateDB } from "../controllers/controls";
import { debugPost } from "../controllers/controls";
import { debugGet } from "../controllers/controls";

const router = Router();

router.get("/firebaseStatus", firebaseStatus);
router.post("/populateDB", populateDB);
router.get("/debug", debugGet);
router.post("/debug", debugPost);

export default router;
