import mongoose from "mongoose";

const departmentJobSchema = new mongoose.Schema(
  {
    nameOfPosition: { type: String, required: true },
    totalVacancies: { type: Number, required: true },
    location: { type: String, required: true },
    lastDateOfSubmission: { type: Date, required: true },
    postedOn: { type: Date, required: true },
    noOfFilledPosition: { type: Number, default: 0 },
    dateOfAdvertisement: { type: Date, required: true },
    departmentType: {
      type: String,
      enum: ["GovtDept", "AidedDept", "PublicUndertaking"],
      required: true,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "departmentType",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobDescriptionFile: { type: String, default: null }, // <-- NEW
  },
  { timestamps: true }
);

export default mongoose.models.DepartmentJob ||
  mongoose.model("DepartmentJob", departmentJobSchema);
