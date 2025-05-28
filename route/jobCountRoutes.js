import express from "express";
import { getJobCounts } from "../controllers/jobCountController.js";

const router = express.Router();
router.get("/", getJobCounts);
export default router;
