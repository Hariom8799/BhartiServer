import express from "express";
const router = express.Router();
import {
  getAllCertificates,
  getCertificateById,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} from "../controllers/stateCertificatesController.js";
import multer from "multer";
const upload = multer({ dest: "uploads/" });

// Routes
router.get("/", getAllCertificates);
router.get("/:id", getCertificateById);
router.post(
  "/",
  upload.fields([
    { name: "images", maxCount: 2 },
    { name: "jobDescriptionFile", maxCount: 1 },
  ]),
  createCertificate
);
router.put(
  "/:id",
  upload.fields([
    { name: "images", maxCount: 2 },
    { name: "jobDescriptionFile", maxCount: 1 },
  ]),
  updateCertificate
);
router.delete("/:id", deleteCertificate);

export default router;
