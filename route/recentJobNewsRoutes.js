import express from "express";
import multer from "multer";
import {
  getRecentJobs,
  getRecentJobById,
  createRecentJob,
  updateRecentJob,
  deleteRecentJob,
} from "../controllers/recentJobNewsController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Temp storage for Cloudinary uploads

router.get("/", getRecentJobs);
router.get("/:id", getRecentJobById);
router.post("/", upload.array("images", 2), createRecentJob); // max 2 images expected
router.put("/:id", upload.array("images", 2), updateRecentJob);
router.delete("/:id", deleteRecentJob);

export default router;
