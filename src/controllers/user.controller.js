import { UserModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    if (!userId) return;
    const user = await UserModel.findById(userId);

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Error while generating referesh and access token", error);
    throw new error(error);
  }
};

const options = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  domain: "medcare-server.vercel.app",
  maxAge: 15 * 60 * 1000,
};

const registerUser = async (req, res) => {
  try {
    const {
      username,
      fullName,
      email,
      password,
      confirmPassword,
      role,
      avatar,
    } = req.body;

    // 1️⃣ validation
    if (
      !username ||
      !fullName ||
      !email ||
      !password ||
      !confirmPassword ||
      !role
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // 2️⃣ Check if user exists (including deleted)
    const existingUser = await UserModel.findOne({
      $or: [{ email }, { username }],
    });

    // 3️⃣ If exists and not deleted → block
    if (existingUser && !existingUser.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // 4️⃣ If exists but deleted → reactivate
    if (existingUser && existingUser.isDeleted) {
      existingUser.isDeleted = false;
      existingUser.deletedAt = null;
      existingUser.password = password;
      existingUser.fullName = fullName;
      existingUser.role = role;

      await existingUser.save();

      const safeUser = existingUser.toObject();
      delete safeUser.password;
      delete safeUser.refreshToken;

      return res.status(200).json({
        success: true,
        message: "Account reactivated successfully",
        user: safeUser,
      });
    }

    // 5️⃣ Otherwise create new user
    const user = await UserModel.create({
      username,
      fullName,
      email,
      password,
      role,
      avatar: avatar || "",
    });

    const createdUser = await UserModel.findById(user._id).select(
      "-password -refreshToken",
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: createdUser,
    });
  } catch (error) {
    //handle duplicity error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email or username already taken",
      });
    }

    console.error("registerUser error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "email and password not exist" });
    }
    const user = await UserModel.findOne({ email }).select("+password");

    if (!user || user.isDeleted) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials or account deleted",
      });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid user credentials" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id,
    );

    const loggedInUser = await UserModel.findById(user._id).select(
      "-password -refreshToken",
    );

    return res
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .status(200)
      .json({
        success: true,
        message: "user login successfully",
        user: loggedInUser,
        accessToken,
      });
  } catch (error) {
    console.log("login controller error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const logout = async (req, res) => {
  try {
    await UserModel.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      { new: true },
    );

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({ success: true, message: "user logout successfully" });
  } catch (error) {
    console.log("logout controller error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const incommingRefreshToken =
      req.cookies?.refreshToken || req.body.refreshToken;

    if (!incommingRefreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "incomming refreshToken not exist" });
    }

    const decoded = jwt.verify(
      incommingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "decoded token not match" });
    }

    const user = await UserModel.findById(decoded._id);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "user does not exist" });
    }

    if (incommingRefreshToken !== user?.refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "Refresh token is expired or used" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id,
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({ success: true, message: "access token refreshed successfully" });
  } catch (error) {
    console.log("access token refreshing error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const changeCurrentPassword = async (req, res) => {
  try {
    //1. get current password
    //2. validate the password
    //3. get newPassword and confirm password
    //4. validate the password
    //5. hash the password
    //6. update the password

    const { oldPassword, newPassword, confirmPassword } = req.body;
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "oldPassword, newPassword and confirmPassword not exist",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "newPassword and confirmPassword does not match",
      });
    }

    const user = await UserModel.findOne({ _id: req.user._id });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user doesn't exist" });
    }

    const isPasswordValid = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid user credentials" });
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json({ success: true, message: "password changed successfully" });
  } catch (error) {
    console.log("changeCurrentPassword controller error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "got current user successfully",
      user: req.user,
    });
  } catch (error) {
    console.log("getCurrentUser controller error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const updateAccount = async (req, res) => {
  try {
    const { fullName } = req.body;
    if (!fullName) {
      return res
        .status(400)
        .json({ success: false, message: "fullName does not exist" });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      {
        $set: { fullName },
      },
      { new: true },
    ).select("-password -refreshToken");

    return res.status(200).json({
      success: true,
      message: "acoount updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log("updateAccount controller error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "password does not exist" });
    }

    const user = await UserModel.findById(req.user._id);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user does not exist" });
    }
    console.log(password);
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }

    user.isDeleted = true;
    user.deletedAt = new Date();
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "account deleted successfully" });
  } catch (error) {
    console.log("deleteAccount controller error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export {
  registerUser,
  loginUser,
  logout,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccount,
  deleteAccount,
};
