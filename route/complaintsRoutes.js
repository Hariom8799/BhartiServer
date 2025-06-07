import express from "express";
const router = express.Router();
import  {getComplaints,postComplaints}  from "../controllers/complaintsController.js";

router.get("/", getComplaints);
router.post("/", postComplaints);

export default router;
