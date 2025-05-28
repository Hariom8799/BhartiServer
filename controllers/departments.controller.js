import GovtDeptModel from "../models/GovtDepartment.js";
import AidedDeptModel from "../models/AidedDepartment.js";
import PublicUndertakingModel from "../models/PublicUndertaking.js";
import DepartmentJobModel from "../models/DepartmentJob.js";

// GET /api/departments?type=govt|aided|public (optional)
export const getDepartments = async (req, res) => {
  try {
    const type = req.query.type?.toLowerCase();
    let departments = [];

    if (type) {
      switch (type) {
        case "govt":
          departments = await GovtDeptModel.find().sort({ name: 1 });
          break;
        case "aided":
          departments = await AidedDeptModel.find().sort({ name: 1 });
          break;
        case "public":
          departments = await PublicUndertakingModel.find().sort({ name: 1 });
          break;
        default:
          return res.status(400).json({
            success: false,
            error: "Invalid department type",
          });
      }
    } else {
      const [govt, aided, publicUndertaking] = await Promise.all([
        GovtDeptModel.find().sort({ name: 1 }),
        AidedDeptModel.find().sort({ name: 1 }),
        PublicUndertakingModel.find().sort({ name: 1 }),
      ]);
      departments = [...govt, ...aided, ...publicUndertaking];
    }

    const depMap = {
      AidedDept: "Aided",
      GovtDept: "Govt",
      PublicUndertaking: "Public",
    };

    const enrichedDepartments = await Promise.all(
      departments.map(async (dept) => {
        const jobCount = await DepartmentJobModel.countDocuments({
          departmentId: dept._id,
        });

        const plainDept = dept.toObject();
        return {
          ...plainDept,
          jobCount,
          type: depMap[dept.constructor.modelName],
        };
      })
    );

    return res.status(200).json({
      success: true,
      departments: enrichedDepartments,
    });
  } catch (error) {
    console.error("Error fetching departments:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
