import mongoose from "mongoose";
import StateGovernmentModel from "../models/StateGovernmentCertificate.js";
import  recentJobSchema  from "../validations/index.js";
import { uploadImages } from "../utils/ImageUpload.js";

// Get all state certificates
export const getAllCertificates = async (req, res) => {
  try {
    const data = await StateGovernmentModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "State certificates fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch state certificates",
      error: error.message,
    });
  }
};

// Get certificate by ID
export const getCertificateById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await StateGovernmentModel.findById(id);
    if (!job) {
      return res
        .status(404)
        .json({ success: false, message: "Certificate not found" });
    }
    res.status(200).json({
      success: true,
      message: "Certificate fetched successfully",
      data: job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch certificate",
      error: error.message,
    });
  }
};

// Create a new certificate
export const createCertificate = async (req, res) => {
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
  
      const newJob = await StateGovernmentModel.create(parsed.data);
      res
        .status(201)
        .json({ success: true, message: "Created successfully", data: newJob });
    } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create certificate",
      error: error.message,
    });
  }
};

// Update certificate
export const updateCertificate = async (req, res) => {
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
  
      const updatedJob = await StateGovernmentModel.findByIdAndUpdate(
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
      message: "Failed to update certificate",
      error: error.message,
    });
  }
};

// Delete certificate
export const deleteCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await StateGovernmentModel.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Certificate not found" });
    }

    res.status(200).json({
      success: true,
      message: "Certificate deleted successfully",
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete certificate",
      error: error.message,
    });
  }
};
