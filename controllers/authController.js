import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserModel from "../models/User.js";
import connectDB from "../config/connectDb.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const login = async (req, res) => {
  try {
    await connectDB();

    const { username, password } = req.body;

    const user = await UserModel.findOne({ username }).populate("department");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid username or password" });
    }

    const payload = {
      id: user._id,
      username: user.username,
      departmentType: user.departmentType,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
