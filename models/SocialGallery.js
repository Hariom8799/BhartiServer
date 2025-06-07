// models/ImageSlider.js
import mongoose from "mongoose";

const SocialGallerySchema = new mongoose.Schema({
  title: String,
  image : String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.SocialGallery ||
  mongoose.model("SocialGallery", SocialGallerySchema);
