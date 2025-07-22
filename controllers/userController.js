import UserModel from "../models/User.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export const getUsers = async (req, res) => {
  try {
    const { departmentType, departmentId } = req.query;
    const query = {};
    if (departmentType) query.departmentType = departmentType;
    if (departmentId) query.department = departmentId;

    const users = await UserModel.find(query)
      .populate("department")
      .sort({ createdAt: -1 })
      .lean();

    const usersWithoutPassword = users.map(({ password, ...rest }) => rest);
    res.status(200).json({ users: usersWithoutPassword, success: true });
  } catch (err) {
    res.status(500).json({ error: err.message, success: false });
  }
};

export const createUser = async (req, res) => {
  try {
    const {
      name,
      username,
      password,
      departmentType,
      department,
      email,
      active,
    } = req.body;

    if (
      !name ||
      !username ||
      !password ||
      !departmentType ||
      !department ||
      active === undefined
    ) {
      return res
        .status(400)
        .json({ error: "All fields are required", success: false });
    }

    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username already exists", success: false });
    }

    const departmentTypeRef = {
      Govt: "GovtDept",
      Aided: "AidedDept",
      Public: "PublicUndertaking",
    }[departmentType];

    if (!departmentTypeRef) {
      return res
        .status(400)
        .json({ error: "Invalid department type", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      name,
      username,
      password: hashedPassword,
      email: email || "",
      departmentType,
      department,
      departmentTypeRef,
      active,
    });

    await user.save();
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(201).json({ user: userWithoutPassword, success: true });
  } catch (err) {
    res.status(500).json({ error: err.message, success: false });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID", success: false });
    }

    const user = await UserModel.findById(id).populate("department").lean();
    if (!user) {
      return res.status(404).json({ error: "User not found", success: false });
    }
    const { password, ...userWithoutPassword } = user;
  
    res.status(200).json({ user: user, success: true });
  } catch (err) {
    res.status(500).json({ error: err.message, success: false });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID", success: false });
    }

    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found", success: false });
    }

    if (data.username && data.username !== user.username) {
      const existingUser = await UserModel.findOne({
        username: data.username,
        _id: { $ne: id },
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ error: "Username already exists", success: false });
      }
    }

    if (data.departmentType) {
      data.departmentTypeRef = {
        Govt: "GovtDept",
        Aided: "AidedDept",
        Public: "PublicUndertaking",
      }[data.departmentType];

      if (!data.departmentTypeRef) {
        return res
          .status(400)
          .json({ error: "Invalid department type", success: false });
      }
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(id, data, {
      new: true,
    }).lean();
    const { password, ...userWithoutPassword } = updatedUser;

    res.status(200).json({ user: userWithoutPassword, success: true });
  } catch (err) {
    res.status(500).json({ error: err.message, success: false });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID", success: false });
    }

    const deleted = await UserModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "User not found", success: false });
    }

    res
      .status(200)
      .json({ message: "User deleted successfully", success: true });
  } catch (err) {
    res.status(500).json({ error: err.message, success: false });
  }
};
