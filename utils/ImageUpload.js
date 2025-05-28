// utils/ImageUpload.js
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
  secure: true,
});

export async function uploadImages(request) {
  try {
    const image = request.files;
    const imagesArr = [];

    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: false,
      resource_type: "auto", // important for pdf or docx files
    };

    for (let i = 0; i < image?.length; i++) {
      const result = await cloudinary.uploader.upload(image[i].path, options);
      imagesArr.push(result.secure_url);
      fs.unlinkSync(image[i].path); // clean up local file
    }

    return { success: true, images: imagesArr };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
