// models/ContactUs.js
import mongoose from "mongoose";

const ContactUsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    contactNo: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const ContactUs = mongoose.model("ContactUs", ContactUsSchema);
export default ContactUs;
