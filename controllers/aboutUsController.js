import AboutUs from "../models/AboutUs.js";
import { uploadImages } from "../utils/ImageUpload.js";
import { deleteImage } from "../utils/ImageUpload.js";

export const deleteAboutUsImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Image URL is required",
      });
    }

    // Delete image from Cloudinary
    const deleteResult = await deleteImage(imageUrl);

    if (!deleteResult.success) {
      return res.status(500).json({
        success: false,
        message: deleteResult.error,
      });
    }

    // Remove image from database
    const aboutUs = await AboutUs.findOne();
    if (aboutUs) {
      aboutUs.images = aboutUs.images.filter((img) => img !== imageUrl);
      await aboutUs.save();
    }

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getAboutUs = async (req, res) => {
  try {
    const aboutUs = await AboutUs.findOne({ status: "active" }).lean();
    res.status(200).json({ success: true, data: aboutUs || null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateAboutUs = async (req, res) => {
  try {
    const {
      title,
      shortDescription,
      subTitle,
      longDescription,
      status = "inactive",
    } = req.body;

    // Validate required fields
    if (!title || !shortDescription || !subTitle || !longDescription) {
      return res.status(400).json({
        success: false,
        message:
          "All fields (title, shortDescription, subTitle, longDescription) are required",
      });
    }

    const data = {
      title,
      shortDescription,
      subTitle,
      longDescription,
      status,
    };

    // Handle image uploads
    let imagePaths = [];
    if (req.files && req.files.length > 0) {
      const urls = await uploadImages(req);
      if (urls.images && urls.images.length > 0) {
        imagePaths = urls.images;
      }
    }

    let aboutUs = await AboutUs.findOne();

    if (aboutUs) {
      // Update existing document
      Object.assign(aboutUs, data);

      // Only add new images to existing ones (don't replace all images)
      if (imagePaths.length > 0) {
        aboutUs.images = [...(aboutUs.images || []), ...imagePaths];
      }
    } else {
      // Create new document
      aboutUs = new AboutUs({ ...data, images: imagePaths });
    }

    await aboutUs.save();

    res.status(200).json({ success: true, data: aboutUs });
  } catch (error) {
    console.error("Error updating About Us:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
