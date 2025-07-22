import mongoose from "mongoose";
import AidedDepartment from "../models/AidedDepartment.js";
import path from "path";
import fs from "fs";
import { uploadImages } from "../utils/ImageUpload.js";

const uploadTempDir = path.join(process.cwd(), "tmp_uploads");

// Ensure tmp_uploads folder exists
if (!fs.existsSync(uploadTempDir)) {
  fs.mkdirSync(uploadTempDir, { recursive: true });
}

const getFieldValue = (field) => (Array.isArray(field) ? field[0] : field);

export const createDepartment = async (req, res) => {
  try {
    const { name, language } = req.body;
    if (!name || !language) {
      return res
        .status(400)
        .json({ success: false, message: "Name and language are required" });
    }

    let mainImgUrl = null;

    if (req.files && req.files.length > 0) {
      const uploadResult = await uploadImages(req);
      if (uploadResult.images.length > 0) {
        mainImgUrl = uploadResult.images[0];
      }
    }

    const department = await AidedDepartment.create({
      name,
      language,
      mainImg: mainImgUrl,
    });

    res.status(201).json({ success: true, department });
  } catch (error) {
    console.error("createDepartment error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create department",
      error: error.message,
    });
  }
};

export const getDepartments = async (req, res) => {
  try {
    const departments = await AidedDepartment.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, departments });
  } catch (error) {
    console.error("getDepartments error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getDepartmentById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid department ID" });
  }

  try {
    const department = await AidedDepartment.findById(id);
    if (!department) {
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });
    }

    return res.status(200).json({ success: true, department });
  } catch (error) {
    console.error("getDepartmentById error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDepartment = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid department ID" });
  }

  try {
    const { name, language, existingMainImg } = req.body;

    if (!name || !language) {
      return res
        .status(400)
        .json({ success: false, message: "Name and language are required" });
    }

    let mainImgUrl = existingMainImg || null;

    if (req.files && req.files.length > 0) {
      const uploadResult = await uploadImages(req);
      if (uploadResult.images.length > 0) {
        mainImgUrl = uploadResult.images[0];
      }
    }

    const updated = await AidedDepartment.findByIdAndUpdate(
      id,
      { name, language, mainImg: mainImgUrl },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });
    }

    res.status(200).json({ success: true, department: updated });
  } catch (error) {
    console.error("updateDepartment error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDepartment = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid department ID" });
  }

  try {
    const department = await AidedDepartment.findByIdAndDelete(id);
    if (!department) {
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Department deleted successfully",
      department,
    });
  } catch (error) {
    console.error("deleteDepartment error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const aidedController = {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
};