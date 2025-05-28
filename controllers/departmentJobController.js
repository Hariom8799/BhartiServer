import DepartmentJob from "../models/DepartmentJob.js";
import mongoose from "mongoose";
import { uploadImages } from "../utils/ImageUpload.js";

export const getDepartmentJobs = async (req, res) => {
  try {
    const { departmentType, departmentId } = req.query;
    const filter = { createdBy: req.user._id };

    if (departmentType) filter.departmentType = departmentType;
    if (departmentId && mongoose.Types.ObjectId.isValid(departmentId)) {
      filter.departmentId = departmentId;
    }

    const jobs = await DepartmentJob.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, jobs });
  } catch (error) {
    console.log("Error fetching department jobs:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getDepartmentJobsPublic = async (req, res) => {
  try {
    const { departmentType, departmentId } = req.query;
    const filter = { };

    if (departmentType) filter.departmentType = departmentType;
    if (departmentId && mongoose.Types.ObjectId.isValid(departmentId)) {
      filter.departmentId = departmentId;
    }

    const jobs = await DepartmentJob.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, jobs });
  } catch (error) {
    console.log("Error fetching department jobs:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getDepartmentJobById = async (req, res) => {
  try {
    const job = await DepartmentJob.findById(req.params.id);
    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });

    return res.status(200).json({ success: true, job });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const createDepartmentJob = async (req, res) => {
  try {
    const {
      nameOfPosition,
      totalVacancies,
      location,
      lastDateOfSubmission,
      postedOn,
      dateOfAdvertisement,
      departmentType,
      departmentId,
      dateOfJobPosted,
    } = req.body;

    const requiredFields = [
      nameOfPosition,
      totalVacancies,
      location,
      lastDateOfSubmission,
      postedOn,
      dateOfAdvertisement,
      departmentType,
      departmentId,
    ];

    if (requiredFields.some((field) => !field)) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    let jobDescriptionFile = null;

    if (req.files && req.files.length > 0) {
      const uploaded = await uploadImages(req);

      if (!uploaded.success) {
        return res.status(500).json({
          success: false,
          message: "Image/PDF upload failed",
          error: uploaded.error,
        });
      }

      jobDescriptionFile = uploaded.images?.[0] || null;
    }

    const job = await DepartmentJob.create({
      nameOfPosition,
      totalVacancies,
      location,
      lastDateOfSubmission,
      postedOn,
      dateOfAdvertisement,
      dateOfJobPosted,
      departmentType,
      departmentId,
      jobDescriptionFile,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const updateDepartmentJob = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.files && req.files.length > 0) {
      const uploaded = await uploadImages(req, res);
      updateData.jobDescriptionFile = uploaded?.images?.[0];
    }

    const updated = await DepartmentJob.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated)
      return res.status(404).json({ success: false, message: "Job not found" });

    return res.status(200).json({ success: true, job: updated });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteDepartmentJob = async (req, res) => {
  try {
    const job = await DepartmentJob.findByIdAndDelete(req.params.id);
    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });

    return res.status(200).json({ success: true, message: "Job deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
