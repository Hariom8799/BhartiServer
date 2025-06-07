import express from "express";
import multer from "multer";
import {
  getAllSkillDevelopments,
  getSkillDevelopmentById,
  createSkillDevelopment,
  updateSkillDevelopment,
  deleteSkillDevelopment,
} from "../controllers/skillDevelopment.controller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/", getAllSkillDevelopments);
router.get("/:id", getSkillDevelopmentById);
router.post(
  "/",
  upload.fields([
    { name: "images", maxCount: 2 },
    { name: "jobDescriptionFile", maxCount: 1 },
  ]),
  createSkillDevelopment
);
router.put(
  "/:id",
  upload.fields([
    { name: "images", maxCount: 2 },
    { name: "jobDescriptionFile", maxCount: 1 },
  ]),
  updateSkillDevelopment
);
router.delete("/:id", deleteSkillDevelopment);

export default router;
