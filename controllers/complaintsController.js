import Complaint  from "../models/Complaint.js";

const getComplaints = async (req, res) => {
  try {
    const data = await Complaint.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default getComplaints;