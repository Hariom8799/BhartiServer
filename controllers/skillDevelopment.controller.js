import mongoose from "mongoose";
import SkillDevelopmentModel from "../models/SkillDevelopmentProgram.js";
import { uploadImages, deleteImage } from "../utils/ImageUpload.js";
import recentJobSchema from "../validations/index.js";

// Get all skill development entries
export const getAllSkillDevelopments = async (req, res) => {
  try {
    const jobs = await SkillDevelopmentModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Skill development data fetched successfully",
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching data",
      error: error.message,
    });
  }
};

// Get a specific skill development entry by ID
export const getSkillDevelopmentById = async (req, res) => {
  try {
    const job = await SkillDevelopmentModel.findById(req.params.id);
    if (!job)
      return res.status(404).json({ success: false, message: "Not found" });

    res.status(200).json({ success: true, message: "Fetched", data: job });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching data",
      error: error.message,
    });
  }
};

// Create new skill development entry
export const createSkillDevelopment = async (req, res) => {
  try {
    const {
      title,
      shortDescription,
      longDescription,
      status = "inactive",
      createdBy,
    } = req.body;

    let thumbnailUrl;
    let mainImgUrl;
    let jobDescriptionFile = null;

    const allFiles = [
      ...(req.files?.images || []),
      ...(req.files?.jobDescriptionFile || []),
    ];

    if (allFiles.length > 0) {
      const uploaded = await uploadImages({ files: allFiles });

      if (!uploaded.success) {
        return res.status(500).json({
          success: false,
          message: "File upload failed",
          error: uploaded.error,
        });
      }

      const imageFiles = req.files?.images || [];
      if (imageFiles.length >= 1) thumbnailUrl = uploaded.images[0];
      if (imageFiles.length >= 2) mainImgUrl = uploaded.images[1];

      if (req.files?.jobDescriptionFile?.length) {
        const docIndex = imageFiles.length;
        jobDescriptionFile = uploaded.images[docIndex];
      }
    }

    if (!thumbnailUrl || !mainImgUrl) {
      return res.status(400).json({
        success: false,
        message: "Images are required",
      });
    }

    const dataToValidate = {
      title,
      shortDescription,
      longDescription,
      status,
      thumbnail: thumbnailUrl,
      mainImg: mainImgUrl,
    };

    if (jobDescriptionFile) dataToValidate.document = jobDescriptionFile;

    if (createdBy && mongoose.Types.ObjectId.isValid(createdBy)) {
      dataToValidate.createdBy = createdBy;
    }

    const parsed = recentJobSchema.safeParse(dataToValidate);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.errors,
      });
    }

    const newJob = await SkillDevelopmentModel.create(parsed.data);
    res.status(201).json({
      success: true,
      message: "Created successfully",
      data: newJob,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Creation failed",
      error: error.message,
    });
  }
};

// Update skill development entry
export const updateSkillDevelopment = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      shortDescription,
      longDescription,
      status,
      createdBy,
      existingThumbnail,
      existingMainImg,
      existingJobDescriptionFile,
    } = req.body;

    let thumbnailUrl = existingThumbnail || null;
    let mainImgUrl = existingMainImg || null;
    let jobDescriptionFile = existingJobDescriptionFile || null;

    const allFiles = [
      ...(req.files?.images || []),
      ...(req.files?.jobDescriptionFile || []),
    ];

    if (allFiles.length > 0) {
      const uploaded = await uploadImages({ files: allFiles });

      if (!uploaded.success) {
        return res.status(500).json({
          success: false,
          message: "File upload failed",
          error: uploaded.error,
        });
      }

      const imageFiles = req.files?.images || [];
      if (imageFiles.length >= 1) thumbnailUrl = uploaded.images[0];
      if (imageFiles.length >= 2) mainImgUrl = uploaded.images[1];

      if (req.files?.jobDescriptionFile?.length) {
        const docIndex = imageFiles.length;
        jobDescriptionFile = uploaded.images[docIndex];
      }
    }

    const dataToValidate = {};

    if (title) dataToValidate.title = title;
    if (shortDescription) dataToValidate.shortDescription = shortDescription;
    if (longDescription) dataToValidate.longDescription = longDescription;
    if (status) dataToValidate.status = status;
    if (thumbnailUrl) dataToValidate.thumbnail = thumbnailUrl;
    if (mainImgUrl) dataToValidate.mainImg = mainImgUrl;
    if (jobDescriptionFile) dataToValidate.document = jobDescriptionFile;

    if (createdBy && mongoose.Types.ObjectId.isValid(createdBy)) {
      dataToValidate.createdBy = createdBy;
    }

    const parsed = recentJobSchema.partial().safeParse(dataToValidate);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.errors,
      });
    }

    const updatedJob = await SkillDevelopmentModel.findByIdAndUpdate(
      id,
      parsed.data,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedJob)
      return res.status(404).json({ success: false, message: "Not found" });

    res.status(200).json({
      success: true,
      message: "Updated successfully",
      data: updatedJob,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Update failed",
      error: error.message,
    });
  }
};

// Delete skill development entry
export const deleteSkillDevelopment = async (req, res) => {
  try {
    const deletedJob = await SkillDevelopmentModel.findByIdAndDelete(
      req.params.id
    );

    if (!deletedJob)
      return res.status(404).json({ success: false, message: "Not found" });

    const { thumbnail, mainImg, document } = deletedJob;

    await deleteImage(thumbnail);
    await deleteImage(mainImg);
    await deleteImage(document);

    res.status(200).json({
      success: true,
      message: "Deleted successfully",
      data: deletedJob,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Delete failed",
      error: error.message,
    });
  }
};
