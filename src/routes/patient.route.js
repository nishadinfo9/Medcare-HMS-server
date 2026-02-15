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
router.route("/patient/add").post(verifyJWT, addPatient);
router.route("/patient/all").get(verifyJWT, getAllPatients);
router.route("/patient/single/:patientId").get(verifyJWT, singlePatient);
router.route("/patient/update/:patientId").patch(verifyJWT, updatePatient);
router.route("/patient/delete/:patientId").delete(verifyJWT, deletePatient);
router.route("/patient/assign/:patientId").patch(verifyJWT, assignDoctor);

export default router;
