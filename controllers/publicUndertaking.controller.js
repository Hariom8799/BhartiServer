import PublicUndertakingModel from "../models/PublicUndertaking.js";
import { uploadImages } from "../utils/ImageUpload.js";
import mongoose from "mongoose";

// Get all departments
export const getAllPublicUndertakings = async (req, res) => {
  try {
    const departments = await PublicUndertakingModel.find().sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, departments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single department
export const getPublicUndertakingById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid ID" });
  }

  try {
    const department = await PublicUndertakingModel.findById(id);
    if (!department) {
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });
    }
    res.status(200).json({ success: true, department });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a department
export const createPublicUndertaking = async (req, res) => {
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

    const department = await PublicUndertakingModel.create({
      name,
      language,
      mainImg: mainImgUrl,
    });

    res.status(201).json({ success: true, department });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a department
export const updatePublicUndertaking = async (req, res) => {
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

    const updated = await PublicUndertakingModel.findByIdAndUpdate(
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
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a department
export const deletePublicUndertaking = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid ID" });
  }

  try {
    const department = await PublicUndertakingModel.findByIdAndDelete(id);
    if (!department) {
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Department deleted", department });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
