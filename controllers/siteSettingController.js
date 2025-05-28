import SiteSetting from "../models/SiteSetting.js";
import { uploadImages } from "../utils/ImageUpload.js";
import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";

const uploadTempDir = path.join(process.cwd(), "tmp_uploads");
if (!fs.existsSync(uploadTempDir))
  fs.mkdirSync(uploadTempDir, { recursive: true });

const getField = (field) => (Array.isArray(field) ? field[0] : field);

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
  const form = new IncomingForm({
    uploadDir: uploadTempDir,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024,
  });

  try {
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const data = {
      siteTitle: getField(fields.siteTitle),
      about: getField(fields.about),
      email: getField(fields.email),
      contactNo: getField(fields.contactNo),
      facebook: getField(fields.facebook),
      instagram: getField(fields.instagram),
      twitter: getField(fields.twitter),
      linkedin: getField(fields.linkedin),
    };

    if (files.logo) {
      const uploadResult = await uploadImages([files.logo.filepath]);
      data.logo = uploadResult[0].secure_url;
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
    res.status(500).json({ success: false, message: "Server error" });
  }
};
