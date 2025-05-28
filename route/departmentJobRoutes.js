
import express from "express";
import {
  getDepartmentJobs,
  getDepartmentJobById,
  createDepartmentJob,
  updateDepartmentJob,
  deleteDepartmentJob,
  getDepartmentJobsPublic,
} from "../controllers/departmentJobController.js";
import multer from "multer";
import { requireAuth } from "../middlewares/auth.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // temp local storage for multer

router.get("/",requireAuth, getDepartmentJobs);
router.get("/getAllJobs", getDepartmentJobsPublic); 
router.get("/:id",requireAuth, getDepartmentJobById);
router.post("/", requireAuth, upload.array("jobDescriptionFile"), createDepartmentJob);
router.put("/:id",requireAuth, upload.array("jobDescriptionFile"), updateDepartmentJob);
router.delete("/:id",requireAuth, deleteDepartmentJob);

export default router;
