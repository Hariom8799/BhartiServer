import mongoose from "mongoose";

const AboutUsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    shortDescription : {type : String, required: true},
    subTitle: { type: String, required: true },
    longDescription: { type: String, required: true },
    images: [String], 
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

const AboutUs = mongoose.model("AboutUs", AboutUsSchema);

export default AboutUs;
