import mongoose from "mongoose";

const SiteSettingSchema = new mongoose.Schema(
  {
    siteTitle: { type: String, required: true },
    email: { type: String, required: true },
    contactNo: { type: String, required: true },
    logo: { type: String }, // path to uploaded logo
    facebook: { type: String },
    instagram: { type: String },
    twitter: { type: String },
    linkedin: { type: String },
    iframe: { type: String }, 
  },
  { timestamps: true }
);

export default mongoose.models.SiteSetting ||
  mongoose.model("SiteSetting", SiteSettingSchema);
