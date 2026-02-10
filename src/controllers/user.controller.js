import { UserModel } from "../models/user.model.js";

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
};

const regieterUser = async (req, res) => {
  try {
    const { username, fullName, email, password, confirmPassword, avatar } =
      req.body;
    console.log(req.body);

    if (!username || !fullName || !email || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "all field are empty" });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "password does not match" });
    }

    const existUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    });

    if (existUser) {
      return res
        .status(400)
        .json({ success: false, message: "user already exist" });
    }

    // if (avatar) return; //avatar logic

    const user = await UserModel.create({
      username,
      fullName,
      email,
      password,
      avatar: avatar || "",
    });
    console.log("user", user);

    const createdUser = await UserModel.findById(user._id).select(
      "-password -refreshToken",
    );

    if (!createdUser) {
      return res.status(401).json({
        success: false,
        message: "Something went wrong while registering the user",
      });
    }

    return res.status(201).json({
      success: true,
      message: "user registered successfully",
      user: createdUser,
    });
  } catch (error) {
    console.log("registerUser controller error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
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

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user doesn't exist" });
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
        refreshToken,
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
          refreshToken: 1, // this removes the field from document
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
export { regieterUser, loginUser, logout, changeCurrentPassword };
