import DepartmentJob from "../models/DepartmentJob.js";

export const getJobCounts = async (req, res) => {
  try {
    const { year } = req.query;
    if (!year) {
      return res
        .status(400)
        .json({ success: false, message: "Year is required" });
    }

    const [startYear, endYear] = year.split("-").map(Number);
    const startDate = new Date(`${startYear}-01-01`);
    const endDate = new Date(`${endYear}-12-31`);

    const jobs = await DepartmentJob.find({
      dateOfAdvertisement: { $gte: startDate, $lte: endDate },
    });

    const publishedCount = jobs.reduce(
      (sum, job) => sum + (job.totalVacancies || 0),
      0
    );
    const filledCount = jobs.reduce(
      (sum, job) => sum + (job.noOfFilledPosition || 0),
      0
    );

    return res.status(200).json({
      success: true,
      publishedCount,
      filledCount,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
