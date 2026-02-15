import { PatientModel } from "../models/patient.model.js";

const addPatient = async (req, res) => {
  try {
    const {
      patientName,
      age,
      gender,
      contact,
      address,
      assignedDoctor,
      medicalHistory = [],
    } = req.body;
    if (
      (!patientName ||
        !age ||
        !gender ||
        !contact ||
        !address ||
        !assignedDoctor,
      assignedDoctor)
    ) {
      return res
        .status(401)
        .json({ success: false, message: "all field are empty" });
    }

    const patients = await PatientModel.create({
      patientName,
      age,
      gender,
      contact,
      address,
      assignedDoctor,
      medicalHistory: medicalHistory.map((item) => ({
        disease: item.disease || "",
        notes: item.notes || "",
        date: item.date ? new Date() : Date.now(),
        doctorId: item.doctorId || assignedDoctor,
      })),
    });

    return res.status(201).json({
      success: true,
      message: "patient created successfully",
      patients,
    });
  } catch (error) {
    console.log("add patient error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const getAllPatients = async (req, res) => {
  try {
    const patients = await PatientModel.find({}).sort({ createdAt: -1 });

    if (!patients) {
      return res
        .status(401)
        .json({ success: false, message: "patients not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "patient found successfully", patients });
  } catch (error) {
    console.log("get all patient error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const singlePatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    if (!patientId) {
      return res
        .status(401)
        .json({ success: false, message: "patient id not exist" });
    }

    const patients = await PatientModel.findOne({ _id: patientId });
    if (!patients) {
      return res
        .status(401)
        .json({ success: false, message: "patient not found" });
    }
    return res.status(200).json({
      success: true,
      message: "patient found successfully",
      patients,
    });
  } catch (error) {
    console.log("singlePatient error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const updatePatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { disease, notes, doctorId, date } = req.body;

    if (!patientId)
      return res
        .status(400)
        .json({ success: false, message: "Patient ID required" });

    if (!disease || !doctorId) {
      return res
        .status(400)
        .json({ success: false, message: "Disease and doctorId required" });
    }

    const patients = await PatientModel.findByIdAndUpdate(
      patientId,
      {
        $push: {
          medicalHistory: {
            disease,
            notes: notes || "",
            doctorId,
            date: date || Date.now(),
          },
        },
      },
      { new: true },
    );
    return res.status(200).json({
      success: true,
      message: "patient updeted successfully",
      patients: patients,
    });
  } catch (error) {
    console.log("updatePatient error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const deletePatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    if (!patientId) {
      return res
        .status(401)
        .json({ success: false, message: "patientId is not exist" });
    }

    const patients = await PatientModel.findByIdAndDelete(patientId);
    return res.status(200).json({
      success: true,
      message: "patient deleted successfully",
      patients,
    });
  } catch (error) {
    console.log("deletePatient error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export {
  addPatient,
  getAllPatients,
  singlePatient,
  updatePatient,
  deletePatient,
};
