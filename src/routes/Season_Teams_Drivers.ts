import { Router } from "express";
import { updateAllDriverFlags } from "../controllers/Driver";
import {
  getAllSeason_Teams_Drivers,
  getBySeason_Teams_Drivers,
} from "../controllers/Season_Teams_Drivers";

const router = Router();

router.get("/all", getAllSeason_Teams_Drivers);
router.get("/year/:year", getBySeason_Teams_Drivers);
router.get("/flags", updateAllDriverFlags);

export default router;
