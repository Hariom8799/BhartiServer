import mongoose from "mongoose";

const AboutUsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    editor: { type: String, required: true }, 
    images: [String], 
    status: { type: String, enum: ["active", "inactive"], default: "inactive" },
  },
  { timestamps: true }
);

const AboutUs = mongoose.model("AboutUs", AboutUsSchema);

export default AboutUs;
