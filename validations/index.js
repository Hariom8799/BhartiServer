import { z } from "zod";

const recentJobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  contactNo : z.string().min(10, "Contact number must be 10 digit").max(10, "Contact number must be 10 digit").optional(),
  shortDescription: z.string().min(1, "Short description is required"),
  longDescription: z.string().min(1, "Long description is required"),
  status: z.enum(["active", "inactive"]).default("inactive"),
  // Accept both relative paths and full URLs
  thumbnail: z.string().min(1, "Thumbnail is required"),
  mainImg: z.string().min(1, "Main image is required"),
  document : z.string().min(1,"Document required"),
  // Make createdBy optional
  createdBy: z.string().optional(),
});

export default recentJobSchema;
