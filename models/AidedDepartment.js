import mongoose, { Schema } from "mongoose";

const AidedDeptSchema = new Schema({
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

const AidedDeptModel = mongoose.model("AidedDept", AidedDeptSchema);
export default AidedDeptModel;
