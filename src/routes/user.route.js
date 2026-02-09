import { Router } from "express";
const router = Router();

//import statement
import {
  regieterUser,
  loginUser,
  logout,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

//execution
router.route("/register").post(regieterUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logout);

export default router;
