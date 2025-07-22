import express from "express";
const router = express.Router();
import {aidedController} from "../controllers/aidedDepartmentController.js";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
// Routes for aided departments

router.get("/", aidedController.getDepartments);
router.post("/", upload.array("mainImg"), aidedController.createDepartment);

router.get("/:id", aidedController.getDepartmentById);
router.put("/:id", upload.array("mainImg"), aidedController.updateDepartment);
router.delete("/:id", aidedController.deleteDepartment);

export default router;