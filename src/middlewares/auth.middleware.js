import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";

export const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken || req?.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Token does not exist" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token" });
    }

    const user = await UserModel.findOne({ _id: decoded._id }).select(
      "-password -refreshToken",
    );

    if (!user || user.isDeleted) {
      return res
        .status(401)
        .json({ success: false, message: "Account inactive or deleted" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("verifyJWT error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
