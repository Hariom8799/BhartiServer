import AboutUs from "../models/AboutUs.js";
import { uploadImages } from "../utils/ImageUpload.js";
import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";

const uploadTempDir = path.join(process.cwd(), "tmp_uploads");
if (!fs.existsSync(uploadTempDir))
  fs.mkdirSync(uploadTempDir, { recursive: true });

const getField = (field) => (Array.isArray(field) ? field[0] : field);

export const getAboutUs = async (req, res) => {
  try {
    const aboutUs = await AboutUs.findOne().lean();
    res.status(200).json({ success: true, data: aboutUs || null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateAboutUs = async (req, res) => {
  const form = new IncomingForm({
    uploadDir: uploadTempDir,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024,
    multiples: true,
  });

  try {
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const title = getField(fields.title);
    const editor = getField(fields.editor);
    const status = getField(fields.status) || "inactive";

    if (!title || !editor) {
      return res
        .status(400)
        .json({ success: false, message: "Title and editor are required" });
    }

    let imagePaths = [];
    if (files.images) {
      const images = Array.isArray(files.images)
        ? files.images
        : [files.images];
      const uploads = await uploadImages(images.map((file) => file.filepath));
      imagePaths = uploads.map((file) => file.secure_url);
    }

    let aboutUs = await AboutUs.findOne();
    if (aboutUs) {
      aboutUs.title = title;
      aboutUs.editor = editor;
      aboutUs.status = status;
      aboutUs.images = [...aboutUs.images, ...imagePaths];
    } else {
      aboutUs = new AboutUs({ title, editor, status, images: imagePaths });
    }

    await aboutUs.save();
    res.status(200).json({ success: true, data: aboutUs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
