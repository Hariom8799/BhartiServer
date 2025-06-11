
import express from "express";
import {
  getDepartmentJobs,
  getDepartmentJobById,
  createDepartmentJob,
  updateDepartmentJob,
  deleteDepartmentJob,
  getDepartmentJobsPublic,
  getAllDepartmentJobs,
} from "../controllers/departmentJobController.js";
import multer from "multer";
import { requireAuth } from "../middlewares/auth.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); 

router.get("/",requireAuth, getDepartmentJobs);
router.get("/getAllJobs", getDepartmentJobsPublic); 
router.get("/all", getAllDepartmentJobs);
router.get("/:id",requireAuth, getDepartmentJobById);
router.post("/", requireAuth, upload.single("jobDescriptionFile"), createDepartmentJob);
router.put(
  "/:id",
  requireAuth,
  upload.single("jobDescriptionFile"),
  updateDepartmentJob
);
router.patch("/visibility/:id", updateDepartmentJob);
router.delete("/:id",requireAuth, deleteDepartmentJob);

export default router;
