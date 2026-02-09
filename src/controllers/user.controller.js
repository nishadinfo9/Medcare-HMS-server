import { UserModel } from "../models/user.model.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = UserModel.findById(userId);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user doesn't exist" });
    }
    const accessToken = await user.generateAccessToken();
    if (!accessToken) {
      return res
        .status(400)
        .json({ success: false, message: "accessToken doesn't exist" });
    }
    const refreshToken = await user.generateRefreshToken();
    if (!refreshToken) {
      return res
        .status(400)
        .json({ success: false, message: "refreshToken doesn't exist" });
    }

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(
      "Something went wrong while generating referesh and access token",
    );
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
    console.log("first");

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
      throw new ApiError(401, "Invalid user credentials");
    }

    const { accessToken, refreshToken } = generateAccessAndRefreshToken(
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
export { regieterUser, loginUser };
