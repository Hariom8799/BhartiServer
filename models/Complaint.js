// models/Complaint.js
import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contactNo: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["pending", "resolved"] , default: "pending" },
  },
  { timestamps: true }
);

const Complaint = mongoose.model("Complaint", ComplaintSchema);
export default Complaint;
