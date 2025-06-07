import mongoose, { Schema } from "mongoose";

const RecentJobNewsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    longDescription: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String, 
      required: true,
    },
    mainImg: {
      type: String, 
      required: true,
    },
    document : {
      type: String, 
      required: true, 
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const RecentJobNewsModel =
  mongoose.model("RecentJobNews", RecentJobNewsSchema);
export default RecentJobNewsModel;
