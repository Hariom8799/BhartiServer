import express from "express";
import { deleteImageController } from "../controllers/generalController.js"; // adjust path as needed

const router = express.Router();

// DELETE route for deleting images
router.delete("/delete-image", deleteImageController);

export default router;
