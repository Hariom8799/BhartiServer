import express from "express";
import {
  getAllDepartments,
  createDepartment,
  getDepartmentById,
  updateDepartmentById,
  deleteDepartmentById,
} from "../controllers/govtDepartmentController.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // temp local storage for multer

router.get("/", getAllDepartments);
router.post("/", upload.array("mainImg"),createDepartment);

router.get("/:id", getDepartmentById);
router.put("/:id", upload.array("mainImg"), updateDepartmentById);
router.delete("/:id", deleteDepartmentById);

export default router;
