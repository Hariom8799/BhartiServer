import Complaint from "../models/Complaint.js";

export const getComplaints = async (req, res) => {
  try {
    const data = await Complaint.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const postComplaints = async (req, res) => {
  try {
    const { name, contactNo, message } = req.body;

    // Validate required fields
    if (!name || !contactNo || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, contact number, and message are required.",
      });
    }

    // Create and save the complaint
    const complaint = await Complaint.create({
      name,
      contactNo,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Complaint submitted successfully.",
      complaint,
    });
  } catch (error) {
    console.error("Error creating complaint:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while submitting complaint.",
      error: error.message,
    });
  }
};

export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!status || !["pending", "resolved"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'pending' or 'resolved'.",
      });
    }

    // Find and update the complaint
    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Complaint status updated successfully.",
      complaint,
    });
  } catch (error) {
    console.error("Error updating complaint status:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating complaint status.",
      error: error.message,
    });
  }
};
