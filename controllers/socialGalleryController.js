import SocialGallery from "../models/SocialGallery.js";
import mongoose from "mongoose";
import { uploadImages, deleteImage } from "../utils/ImageUpload.js";

// Get all social gallery images (for admin or authenticated user)
export const getSocialGallery = async (req, res) => {
  try {
    const images = await SocialGallery.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, images });
  } catch (error) {
    console.error("Error fetching gallery:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Get a single image by ID
export const getSocialGalleryById = async (req, res) => {
  try {
    const image = await SocialGallery.findById(req.params.id);
    if (!image) {
      return res
        .status(404)
        .json({ success: false, message: "Image not found" });
    }
    return res.status(200).json({ success: true, image });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Create a new image entry
export const createSocialGallery = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || !req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Title and image are required" });
    }

    const uploadRequest = { files: [req.file] };
    const uploaded = await uploadImages(uploadRequest);

    if (!uploaded.success) {
      return res
        .status(500)
        .json({ success: false, message: "Image upload failed" });
    }
    console.log("fbkdbkf", uploaded);
    const image = await SocialGallery.create({
      title,
      image: uploaded.images[0],
    });

    console.log("unanabaaa", image)

    return res
      .status(201)
      .json({ success: true, message: "Image added", image });
  } catch (error) {
    console.error("Error creating gallery image:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Update an existing image
export const updateSocialGallery = async (req, res) => {
  try {
    const { title } = req.body;
    const updateData = { title };

    if (req.file) {
      const uploadRequest = { files: [req.file] };
      const uploaded = await uploadImages(uploadRequest);

      if (uploaded.success) {
        updateData.image = uploaded.images[0];

        const existing = await SocialGallery.findById(req.params.id);
        if (existing?.image) {
          await deleteImage(existing.image);
        }
      }
    }

    const updated = await SocialGallery.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Image not found" });

    return res.status(200).json({ success: true, image: updated });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Delete image
export const deleteSocialGallery = async (req, res) => {
  try {
    const image = await SocialGallery.findById(req.params.id);
    if (!image)
      return res
        .status(404)
        .json({ success: false, message: "Image not found" });

    if (image.image) {
      try {
        await deleteImage(image.image);
      } catch (err) {
        console.warn("Image deletion failed:", err);
      }
    }

    await SocialGallery.findByIdAndDelete(req.params.id);

    return res
      .status(200)
      .json({ success: true, message: "Image deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
