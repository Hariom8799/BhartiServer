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
    const files = request.files;
    const filesArr = [];

    for (let i = 0; i < files?.length; i++) {
      const file = files[i];

      // Check if it's a PDF
      const isPdf =
        file.mimetype === "application/pdf" ||
        file.originalname?.toLowerCase().endsWith(".pdf");

      let result;

      if (isPdf) {
        // For PDFs - upload as image resource type for better browser compatibility
        const options = {
          use_filename: true,
          unique_filename: false,
          overwrite: false,
          resource_type: "image", // This allows PDFs to be viewable in browsers
          format: "pdf", // Maintain PDF format
          flags: "attachment", // This helps with downloading
        };

        result = await cloudinary.uploader.upload(file.path, options);

        // Store both viewing URL and download URL
        filesArr.push({
          viewUrl: result.secure_url, // For viewing in browser
          downloadUrl: result.secure_url.replace(
            "/image/upload/",
            "/image/upload/fl_attachment/"
          ), // For downloading
          type: "pdf",
          publicId: result.public_id,
          originalUrl: result.secure_url,
        });
      } else {
        // For non-PDF files (images, etc.)
        const options = {
          use_filename: true,
          unique_filename: false,
          overwrite: false,
          resource_type: "auto",
        };

        result = await cloudinary.uploader.upload(file.path, options);

        filesArr.push({
          viewUrl: result.secure_url,
          downloadUrl: result.secure_url,
          type: "image",
          publicId: result.public_id,
          originalUrl: result.secure_url,
        });
      }

      fs.unlinkSync(file.path); // clean up local file
    }

    return { success: true, files: filesArr };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Alternative function specifically for PDFs only
export async function uploadPDFOnly(request) {
  try {
    const files = request.files;
    const pdfArr = [];

    for (let i = 0; i < files?.length; i++) {
      const file = files[i];

      // Verify it's a PDF
      const isPdf =
        file.mimetype === "application/pdf" ||
        file.originalname?.toLowerCase().endsWith(".pdf");

      if (!isPdf) {
        throw new Error(
          `File ${file.originalname} is not a PDF. Only PDF files are allowed.`
        );
      }

      // Upload PDF with optimized settings for viewing
      const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: false,
        resource_type: "image", // This is key for browser viewing
        format: "pdf",
        pages: true, // Enable page-based transformations
      };

      const result = await cloudinary.uploader.upload(file.path, options);

      // Create multiple URL variants
      const baseUrl = result.secure_url;

      pdfArr.push({
        // Standard viewing URL
        viewUrl: baseUrl,
        // Download URL with attachment flag
        downloadUrl: baseUrl.replace(
          "/image/upload/",
          "/image/upload/fl_attachment/"
        ),
        // Preview URL (first page as image)
        previewUrl: baseUrl.replace(
          "/image/upload/",
          "/image/upload/f_jpg,pg_1/"
        ),
        type: "pdf",
        publicId: result.public_id,
        pages: result.pages || 1,
        originalUrl: baseUrl,
      });

      fs.unlinkSync(file.path);
    }

    console.log("Uploaded PDFs:", pdfArr);

    return { success: true, pdfs: pdfArr };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
