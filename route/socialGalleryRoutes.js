import express from "express";
import multer from "multer";

import {
  getSocialGallery,
  getSocialGalleryById,
  createSocialGallery,
  updateSocialGallery,
  deleteSocialGallery,
} from "../controllers/socialGalleryController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/", getSocialGallery);
router.get("/:id", getSocialGalleryById);
router.post("/", upload.single("image"), createSocialGallery);
router.put("/:id", upload.single("image"), updateSocialGallery);
router.delete("/:id", deleteSocialGallery);

export default router;
