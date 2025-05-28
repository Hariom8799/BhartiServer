import express from "express";
const router = express.Router();
import  getComplaints  from "../controllers/complaintsController.js";

router.get("/", getComplaints);

export default router;
