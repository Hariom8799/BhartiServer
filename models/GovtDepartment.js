import mongoose , {Schema} from "mongoose";

const GovtDeptSchema = new Schema({
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

const GovtDeptModel = mongoose.model("GovtDept", GovtDeptSchema);
export default GovtDeptModel;