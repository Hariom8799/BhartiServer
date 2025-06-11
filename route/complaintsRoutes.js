import express from "express";
const router = express.Router();
import  {getComplaints,postComplaints,updateComplaintStatus}  from "../controllers/complaintsController.js";

router.get("/", getComplaints);
router.post("/", postComplaints);
router.patch("/:id", updateComplaintStatus);

export default router;
