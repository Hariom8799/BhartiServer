import express from "express";
import multer from "multer";
import {
  getSliders,
  getSliderById,
  createSlider,
  updateSlider,
  deleteSlider,
} from "../controllers/imageSliderController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // temporary local storage

// Routes
router.get("/", getSliders);
router.get("/:id", getSliderById);
router.post("/", upload.array("mainImg"), createSlider);
router.put("/:id", upload.array("mainImg"), updateSlider);
router.delete("/:id", deleteSlider);

export default router;
