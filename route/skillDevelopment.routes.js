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
router.post("/", upload.array("images", 2), createSkillDevelopment);
router.put("/:id", upload.array("images", 2), updateSkillDevelopment);
router.delete("/:id", deleteSkillDevelopment);

export default router;
