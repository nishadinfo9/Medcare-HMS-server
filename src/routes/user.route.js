import { Router } from "express";
const router = Router();

//import statement
import {
  regieterUser,
  loginUser,
  logout,
  changeCurrentPassword
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

//execution
router.route("/register").post(regieterUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logout);
router.route("/password-change").post(verifyJWT, changeCurrentPassword);

export default router;
