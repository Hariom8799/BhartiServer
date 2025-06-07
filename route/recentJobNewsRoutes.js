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
// Accept two images and one document
router.post(
  "/",
  upload.fields([
    { name: "images", maxCount: 2 },
    { name: "jobDescriptionFile", maxCount: 1 },
  ]),
  createRecentJob
);
router.put("/:id", upload.fields([
  { name: "images", maxCount: 2 },
  { name: "jobDescriptionFile", maxCount: 1 },
]), updateRecentJob);
router.delete("/:id", deleteRecentJob);

export default router;
