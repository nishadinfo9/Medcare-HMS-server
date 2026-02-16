import { Router } from "express";
const router = Router();

//import
import {
  addAppointment,
  getAllAppointment,
  singleAppointment,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

//execution
router.route("/appointment/add").post(verifyJWT, addAppointment);
router.route("/appointment/all").get(verifyJWT, getAllAppointment);
router
  .route("/appointment/single/:appointmentId")
  .get(verifyJWT, singleAppointment);
router
  .route("/appointment/update/:appointmentId")
  .patch(verifyJWT, updateAppointment);
router
  .route("/appointment/delete/:appointmentId")
  .delete(verifyJWT, deleteAppointment);

export default router;
