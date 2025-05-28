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
  upload.array("images", 2),
  createCertificate
);
router.put("/:id", upload.array("images", 2), updateCertificate);
router.delete("/:id", deleteCertificate);

export default router;
