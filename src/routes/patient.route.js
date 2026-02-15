import { Router } from "express";
const router = Router();

// imports
import {
  addPatient,
  getAllPatients,
  singlePatient,
  updatePatient,
  deletePatient,
  assignDoctor,
} from "../controllers/patient.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

// executions
router.route("/add").post(verifyJWT, addPatient);
router.route("/all").get(verifyJWT, getAllPatients);
router.route("/single/:patientId").get(verifyJWT, singlePatient);
router.route("/update/:patientId").patch(verifyJWT, updatePatient);
router.route("/delete/:patientId").delete(verifyJWT, deletePatient);
router.route("/assign/:patientId").patch(verifyJWT, assignDoctor);

export default router;
