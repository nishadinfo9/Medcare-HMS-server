import { Router } from "express";
const router = Router();

//import statement
import { regieterUser, loginUser } from "../controllers/user.controller.js";

//execution
router.route("/register").post(regieterUser);
router.route("/login").post(loginUser);

export default router;
