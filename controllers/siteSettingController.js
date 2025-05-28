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
      about,
      email,
      contactNo,
      facebook,
      instagram,
      twitter,
      linkedin,
    } = req.body;

    const data = {
      siteTitle,
      about,
      email,
      contactNo,
      facebook,
      instagram,
      twitter,
      linkedin,
    };

    let logoUrl;

    if (req.files && req.files.length > 0) {
      const urls = await uploadImages(req);
      if (urls.images.length > 0) logoUrl = urls.images[0];
    }

    if (logoUrl) {
      data.logo = logoUrl;
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
