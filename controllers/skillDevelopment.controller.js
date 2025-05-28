import SkillDevelopmentModel from "../models/SkillDevelopmentProgram.js";
import mongoose from "mongoose";
import  recentJobSchema from "../validations/index.js";
import { uploadImages } from "../utils/ImageUpload.js";

export const getAllSkillDevelopments = async (req, res) => {
  try {
    const jobs = await SkillDevelopmentModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Job news fetched successfully",
      data: jobs,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching jobs",
        error: error.message,
      });
  }
};

export const getSkillDevelopmentById = async (req, res) => {
  try {
    const job = await SkillDevelopmentModel.findById(req.params.id);
    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });

    res.status(200).json({ success: true, message: "Job fetched", data: job });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching job",
        error: error.message,
      });
  }
};

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

    if (req.files && req.files.length > 0) {
      const urls = await uploadImages(req);

      if (urls.images.length >= 1) thumbnailUrl = urls.images[0];
      if (urls.images.length >= 2) mainImgUrl = urls.images[1];
    }

    if (!thumbnailUrl || !mainImgUrl) {
      return res
        .status(400)
        .json({ success: false, message: "Images are required" });
    }

    const dataToValidate = {
      title,
      shortDescription,
      longDescription,
      status,
      thumbnail: thumbnailUrl,
      mainImg: mainImgUrl,
    };

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
    res
      .status(201)
      .json({ success: true, message: "Created successfully", data: newJob });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating job",
      error: error.message,
    });
  }
};

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
    } = req.body;

    let thumbnailUrl = existingThumbnail;
    let mainImgUrl = existingMainImg;

    if (req.files && req.files.length > 0) {
      const urls = await uploadImages(req);
      if (urls.images.length >= 1) thumbnailUrl = urls.images[0];
      if (urls.images.length >= 2) mainImgUrl = urls.images[1];
    }

    const dataToValidate = {};

    if (title) dataToValidate.title = title;
    if (shortDescription) dataToValidate.shortDescription = shortDescription;
    if (longDescription) dataToValidate.longDescription = longDescription;
    if (status) dataToValidate.status = status;
    if (thumbnailUrl) dataToValidate.thumbnail = thumbnailUrl;
    if (mainImgUrl) dataToValidate.mainImg = mainImgUrl;
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
      message: "Error updating job",
      error: error.message,
    });
  }
};

export const deleteSkillDevelopment = async (req, res) => {
  try {
    const deletedJob = await SkillDevelopmentModel.findByIdAndDelete(
      req.params.id
    );
    if (!deletedJob)
      return res.status(404).json({ success: false, message: "Job not found" });

    res
      .status(200)
      .json({ success: true, message: "Job deleted", data: deletedJob });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error deleting job",
        error: error.message,
      });
  }
};
