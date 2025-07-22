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

    if(!user.active){
      return res
        .status(401)
        .json({ success: false, error: "User is Inactive" });
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

// export const adminLogin = async (req, res) => {
//   try {
//     const { identifier, password } = req.body;

//     // Input validation
//     if (!identifier || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Username/email and password are required",
//       });
//     }

//     // Find user by username or email
//     const user = await UserModel.findOne({
//       $or: [{ username: identifier }, { email: identifier }],
//     });

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // Check if user is admin
//     if (user.userType !== "Admin") {
//       return res.status(403).json({
//         success: false,
//         message: "Access denied. Admins only.",
//       });
//     }

//     // Validate password
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid password",
//       });
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       { id: user._id, role: user.userType },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     // Set token cookie
//     res.cookie("admin_token", token, {
//       httpOnly: false, // Set to true if you want to protect from XSS
//       secure: process.env.NODE_ENV === "production",
//       maxAge: 24 * 60 * 60 * 1000, // 1 day
//       sameSite: "lax",
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Login successful",

//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

export const adminLogin = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Input validation
    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Username/email and password are required",
      });
    }

    // Find user by username or email
    const user = await UserModel.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user is admin
    if (user.userType !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Set token cookie (httpOnly recommended)
    // res.cookie("admin_token", token, {
    //   httpOnly: true,
    //   secure: true, // only over HTTPS
    //   sameSite: "Lax",
    //   maxAge: 24 * 60 * 60 * 1000, // 1 day
    // });

    // Return token + user (for frontend to set in cookies or context)
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token, // in case you want to save manually in client too
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        userType: user.userType,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};