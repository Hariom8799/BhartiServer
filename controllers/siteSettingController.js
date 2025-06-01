import SiteSetting from "../models/SiteSetting.js";
import { uploadImages } from "../utils/ImageUpload.js";

export const getSiteSetting = async (req, res) => {
  try {
    const siteSetting = await SiteSetting.findOne();
    res.status(200).json({ success: true, data: siteSetting });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch site settings" });
  }
};

export const updateSiteSetting = async (req, res) => {
  try {
    const {
      siteTitle,
      email,
      contactNo,
      facebook,
      instagram,
      twitter,
      linkedin,
      iframe,
    } = req.body;

    const data = {
      siteTitle,
      email,
      contactNo,
      facebook,
      instagram,
      twitter,
      linkedin,
      iframe,
    };

    // Handle logo upload if present
    if (req.files && req.files.length > 0) {
      const urls = await uploadImages(req);
      if (urls.images.length > 0) {
        data.logo = urls.images[0]; // Assuming only one logo image is uploaded
      }
    }

    let siteSetting = await SiteSetting.findOne();

    if (siteSetting) {
      Object.assign(siteSetting, data);
    } else {
      siteSetting = new SiteSetting(data);
    }

    await siteSetting.save();
    res.status(200).json({ success: true, data: siteSetting });
  } catch (error) {
    console.error("Error updating site setting:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
