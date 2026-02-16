import { AppointmentModel } from "../models/appointment.model.js";

const addAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, date, reason, status } = req.body;

    if (!patientId || !doctorId || !date) {
      return res.status(401).json({
        success: false,
        message: "patientId, doctorId and date are empty",
      });
    }

    const appointment = await AppointmentModel.create({
      patientId,
      doctorId,
      date,
      reason: reason || "",
      status: status || "pending",
    });

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "appointment created failed" });
    }
    return res.status(201).json({
      success: true,
      message: "appointment created successfully",
      appointment,
    });
  } catch (error) {
    console.log("addAppointment error", error);
    return res
      .status(500)
      .json({ success: true, message: "Internal server error" });
  }
};

const getAllAppointment = async (req, res) => {
  try {
    const appointment = await AppointmentModel.find({}).sort({ createdAt: -1 });
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "appointment not found" });
    }
    return res.status(200).json({
      success: true,
      message: "appointment found successfully",
      appointment,
    });
  } catch (error) {
    console.log("getAllAppointment error", error);
    return res
      .status(500)
      .json({ success: true, message: "Internal server error" });
  }
};

const singleAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    if (!appointmentId) {
      return res
        .status(401)
        .json({ success: false, message: "appointmentId not exist" });
    }

    const appointment = await AppointmentModel.findById(appointmentId);
    if (!appointment) {
      return res
        .status(404)
        .json({ success: true, message: "appointment not found" });
    }

    return res.status(200).json({
      success: true,
      message: "single appointment found successfully",
      appointment,
    });
  } catch (error) {
    console.log("singleAppointment error", error);
    return res
      .status(500)
      .json({ success: true, message: "Internal server error" });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { doctorId, date, reason, status } = req.body;

    if (!appointmentId) {
      return res
        .status(401)
        .json({ success: false, message: "appointmentId not exist" });
    }

    if (!doctorId || !date || !reason || !status) {
      return res.status(401).json({
        success: false,
        message: "doctorId, date, reason and status not exist",
      });
    }

    const update = await AppointmentModel.findByIdAndUpdate(
      appointmentId,
      { doctorId, date, reason, status },
      { new: true },
    );

    if (!update) {
      return res
        .status(401)
        .json({ success: false, message: "appointment updated failed" });
    }

    return res.status(200).json({
      success: true,
      message: "appointment updated successfully",
      appointment: update,
    });
  } catch (error) {
    console.log("updateAppointment error", error);
    return res
      .status(500)
      .json({ success: true, message: "Internal server error" });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    if (!appointmentId) {
      return res
        .status(401)
        .json({ success: false, message: "appointmentId not exist" });
    }

    const deleted = await AppointmentModel.findByIdAndDelete(appointmentId);

    if (!deleted) {
      return res
        .status(401)
        .json({ success: false, message: "appointment deleted failed" });
    }

    return res.status(200).json({
      success: true,
      message: "appointment deleted successfully",
      appointment: deleted,
    });
  } catch (error) {
    console.log("deleteAppointment error", error);
    return res
      .status(500)
      .json({ success: true, message: "Internal server error" });
  }
};

export {
  addAppointment,
  getAllAppointment,
  singleAppointment,
  updateAppointment,
  deleteAppointment,
};
