import RecentJobNewsModel from "../models/RecentJobNews.js";
import { uploadImages } from "../utils/ImageUpload.js";
import mongoose from "mongoose";
import recentJobSchema  from "../validations/index.js";

export const getRecentJobs = async (req, res) => {
  try {
    const jobs = await RecentJobNewsModel.find().sort({ createdAt: -1 });
    res
      .status(200)
      .json({ success: true, message: "Fetched successfully", data: jobs });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Fetch failed", error: error.message });
  }
};

export const getRecentJobById = async (req, res) => {
  try {
    const job = await RecentJobNewsModel.findById(req.params.id);
    if (!job)
      return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Fetch failed", error: error.message });
  }
};

export const createRecentJob = async (req, res) => {
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
  
      const newJob = await RecentJobNewsModel.create(parsed.data);
      res
        .status(201)
        .json({ success: true, message: "Created successfully", data: newJob });
    } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Creation failed",
        error: error.message,
      });
  }
};

export const updateRecentJob = async (req, res) => {
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
      return res
        .status(400)
        .json({
          success: false,
          message: "Validation failed",
          errors: parsed.error.errors,
        });
    }

    const updatedJob = await RecentJobNewsModel.findByIdAndUpdate(
      id,
      parsed.data,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedJob)
      return res.status(404).json({ success: false, message: "Not found" });

    res
      .status(200)
      .json({
        success: true,
        message: "Updated successfully",
        data: updatedJob,
      });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Update failed", error: error.message });
  }
};

export const deleteRecentJob = async (req, res) => {
  try {
    const deletedJob = await RecentJobNewsModel.findByIdAndDelete(
      req.params.id
    );
    if (!deletedJob)
      return res.status(404).json({ success: false, message: "Not found" });

    res
      .status(200)
      .json({
        success: true,
        message: "Deleted successfully",
        data: deletedJob,
      });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Delete failed", error: error.message });
  }
};
