import mongoose, { Schema } from "mongoose";

const PublicUndertakingSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  mainImg: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const PublicUndertakingModel =
  mongoose.model("PublicUndertaking", PublicUndertakingSchema);
export default PublicUndertakingModel;
