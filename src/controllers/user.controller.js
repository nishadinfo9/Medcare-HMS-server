import { UserModel } from "../models/user.model";

const regieterUser = async (req, res) => {
  try {
    const { username, fullName, email, password, confirmPassword, avatar } =
      req.body;

    if (!username || !fullName || !email || !password || confirmPassword) {
      return res.status(400).json({ success: false, message: "" });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "password does not match" });
    }

    const existUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    });

    if (!existUser) {
      return res
        .status(400)
        .json({ success: false, message: "user already exist" });
    }

    if (avatar) return; //avatar logic

    const user = await UserModel.create({
      username,
      fullName,
      email,
      password,
      avatar: avatar || "",
    });

    const createdUser = await UserModel.findById(user._id).select(
      "-password -refreshToken",
    );

    if (!createdUser) {
      return res.status(401).json({
        success: false,
        message: "Something went wrong while registering the user",
      });
    }

    return res
      .status(201)
      .json({ success: true, message: "user registered successfully" });
  } catch (error) {
    console.log("registerUser controller error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
export { regieterUser };
