import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";

export const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken || req.header("Authorization").split(" ")[1];

    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "token does not exist" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await UserModel.findOne({ _id: decoded._id }).select(
      "-password -refreshToken",
    );

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Access Token" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("verifyJWT error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server verifyJWT error" });
  }
};
