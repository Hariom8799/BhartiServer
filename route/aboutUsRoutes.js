import express from "express";
import { deleteAboutUsImage, getAboutUs, updateAboutUs } from "../controllers/aboutUsController.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.get("/", getAboutUs);
router.delete("/delete-image", deleteAboutUsImage);
router.put("/",upload.array("images"), updateAboutUs);

export default router;
