import { Router } from "express";
const router = Router();

// import
import {
  addDoctor,
  getAllDoctors,
  singleDoctor,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctor.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

//execution
router.route("/doctor/add").post(verifyJWT, addDoctor);
router.route("/doctor/all").get(verifyJWT, getAllDoctors);
router.route("/doctor/single/:doctorId").get(verifyJWT, singleDoctor);
router.route("/doctor/update/:doctorId").patch(verifyJWT, updateDoctor);
router.route("/doctor/delete/:doctorId").delete(verifyJWT, deleteDoctor);

export default router;
