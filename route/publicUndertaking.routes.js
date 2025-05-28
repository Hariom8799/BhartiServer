import express from "express";
import {
  getAllPublicUndertakings,
  getPublicUndertakingById,
  createPublicUndertaking,
  updatePublicUndertaking,
  deletePublicUndertaking,
} from "../controllers/publicUndertaking.controller.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // temp local storage for multer

router.get("/", getAllPublicUndertakings);
router.get("/:id", getPublicUndertakingById);
router.post("/", upload.array("mainImg"), createPublicUndertaking);
router.put("/:id", upload.array("mainImg"), updatePublicUndertaking);
router.delete("/:id", deletePublicUndertaking);

export default router;
