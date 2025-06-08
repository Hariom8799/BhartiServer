import fs from "fs";
import { deleteImage, uploadImages } from "../utils/ImageUpload.js";
import ImageSlider from "../models/ImageSlider.js";
// GET all sliders
export const getSliders = async (req, res) => {
  try {
    const sliders = await ImageSlider.find({status : "active"}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: sliders });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch sliders",
      error: error.message,
    });
  }
};

// GET slider by ID
export const getSliderById = async (req, res) => {
  try {
    const slider = await ImageSlider.findById(req.params.id);
    if (!slider)
      return res
        .status(404)
        .json({ success: false, message: "Slider not found" });
    res.status(200).json({ success: true, data: slider });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST create new slider
export const createSlider = async (req, res) => {
  try {
    if (!req.files ) {
      return res
        .status(400)
        .json({ success: false, message: "Main image is required" });
    }

    const uploaded = await uploadImages(req);
    if (!uploaded.success) {
      return res
        .status(500)
        .json({
          success: false,
          message: "Image upload failed",
          error: uploaded.error,
        });
    }

    const { title, description, status } = req.body;

    const slider = await ImageSlider.create({
      title,
      description,
      status: status || "inactive",
      mainImg: uploaded.images[0], // cloudinary URL
    });

    res.status(201).json({ success: true, data: slider });
  } catch (error) {
    console.error("Create slider error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to create slider",
        error: error.message,
      });
  }
};

// PUT update slider by ID
export const updateSlider = async (req, res) => {
  try {
    const { title, description, status, existingMainImg } = req.body;

    let mainImgUrl = existingMainImg;

    if (req.files && req.files.mainImg) {
      const uploaded = await uploadImages(req, "mainImg");
      if (!uploaded.success) {
        return res
          .status(500)
          .json({
            success: false,
            message: "Image upload failed",
            error: uploaded.error,
          });
      }
      mainImgUrl = uploaded.images[0];
    }

    const updatedSlider = await ImageSlider.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        status: status || "inactive",
        mainImg: mainImgUrl,
      },
      { new: true }
    );

    if (!updatedSlider) {
      return res
        .status(404)
        .json({ success: false, message: "Slider not found" });
    }

    res.status(200).json({ success: true, data: updatedSlider });
  } catch (error) {
    console.error("Update slider error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
  

// DELETE slider by ID
export const deleteSlider = async (req, res) => {
  try {
    const deletedSlider = await ImageSlider.findByIdAndDelete(req.params.id);
    const { mainImg } = deletedSlider;
    console.log(mainImg);
    const result = await deleteImage(mainImg);
    if (!result.success) {
      res.status(500).json({
        success: false,
        message: result.error || "Failed to delete image",
      });
    }
    
    if (!deletedSlider) {
      return res
        .status(404)
        .json({ success: false, message: "Slider not found" });
    }
    
    res.status(200).json({ success: true, data: deletedSlider });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
