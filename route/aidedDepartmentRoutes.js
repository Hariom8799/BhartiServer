import express from "express";
const router = express.Router();
import {aidedController} from "../controllers/aidedDepartmentController.js";

// Routes for aided departments

router.get("/", aidedController.getDepartments);
router.post("/", aidedController.createDepartment);

router.get("/:id", aidedController.getDepartmentById);
router.put("/:id", aidedController.updateDepartment);
router.delete("/:id", aidedController.deleteDepartment);

export default router;