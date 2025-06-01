import { deleteImage } from "../utils/ImageUpload.js";

export const deleteImageController = async (req, res) => {
  try {
    const { imageUrl } = req.body;

    // Validate that imageUrl is provided
    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Image URL is required",
      });
    }

    // Call the deleteImage utility function
    const result = await deleteImage(imageUrl);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.error || "Failed to delete image",
      });
    }
  } catch (error) {
    console.error("Error in deleteImageController:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting image",
      error: error.message,
    });
  }
};
