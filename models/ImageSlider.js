// models/ImageSlider.js
import mongoose from "mongoose";

const ImageSliderSchema = new mongoose.Schema({
  title: String,
  description: String,
  mainImg: String,
  status: { type: String, default: "inactive" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.ImageSlider ||
  mongoose.model("ImageSlider", ImageSliderSchema);
