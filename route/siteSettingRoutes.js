import express from "express";
import {
  getSiteSetting,
  updateSiteSetting,
} from "../controllers/siteSettingController.js";

const router = express.Router();

router.get("/", getSiteSetting);
router.put("/", updateSiteSetting);

export default router;
