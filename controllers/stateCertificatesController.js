import mongoose from "mongoose";
import StateGovernmentModel from "../models/StateGovernmentCertificate.js";
import { uploadImages, deleteImage } from "../utils/ImageUpload.js";
import recentJobSchema from "../validations/index.js";

// Get all certificates
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
    const job = await StateGovernmentModel.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Fetch failed",
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

    const newCert = await StateGovernmentModel.create(parsed.data);

    res.status(201).json({
      success: true,
      message: "Created successfully",
      data: newCert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Creation failed",
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

    const updatedCert = await StateGovernmentModel.findByIdAndUpdate(
      id,
      parsed.data,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCert)
      return res.status(404).json({ success: false, message: "Not found" });

    res.status(200).json({
      success: true,
      message: "Updated successfully",
      data: updatedCert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Update failed",
      error: error.message,
    });
  }
};

// Delete certificate
export const deleteCertificate = async (req, res) => {
  try {
    const deleted = await StateGovernmentModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    const { thumbnail, mainImg, document } = deleted;

    await deleteImage(thumbnail);
    await deleteImage(mainImg);
    await deleteImage(document);

    res.status(200).json({
      success: true,
      message: "Deleted successfully",
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Delete failed",
      error: error.message,
    });
  }
};
