import { doctorModel } from "../models/doctor.model.js";

const addDoctor = async (req, res) => {
  try {
    const { doctorName, specialization, contact } = req.body;
    if (!doctorName || !specialization || !contact) {
      return res
        .status(401)
        .json({ success: false, message: "all field is empty" });
    }

    const doctors = await doctorModel.create({
      doctorName,
      specialization,
      contact,
    });

    if (!doctors) {
      return res
        .status(401)
        .json({ success: false, message: "doctors created failed" });
    }
    return res.status(201).json({
      success: false,
      message: "doctors created successfully",
      doctors,
    });
  } catch (error) {
    console.log("addDoctor error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).sort({ createdAt: -1 });
    if (!doctors) {
      return res
        .status(200)
        .json({ success: false, message: "doctors not found" });
    }

    return res.status(200).json({
      success: false,
      message: "all doctors found successfully",
      doctors,
    });
  } catch (error) {
    console.log("getAllDoctors error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const singleDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    if (!doctorId) {
      return res
        .status(401)
        .json({ success: false, message: "doctorId does not exist" });
    }

    const doctors = await doctorModel.findOne({ _id: doctorId });

    if (!doctors) {
      return res
        .status(401)
        .json({ success: false, message: "doctor not found" });
    }

    return res.status(200).json({
      success: true,
      message: "single doctor found successfully",
      doctors,
    });
  } catch (error) {
    console.log("getAllDoctors error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const updateDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { assignedPatients = [], shifts = [] } = req.body;

    if (!doctorId) {
      return res
        .status(401)
        .json({ success: false, message: "doctorId is not exist" });
    }

    if (!assignedPatients.length && !shifts.length) {
      return res.status(400).json({
        success: false,
        message:
          "At least one field (assignedPatients or shifts) must be provided",
      });
    }

    const update = await doctorModel.findByIdAndUpdate(
      doctorId,
      {
        $set: {
          assignedPatients: assignedPatients,
          shifts: shifts.map((item) => ({
            day: item.day,
            startTime: item.startTime,
            endTime: item.endTime,
          })),
        },
      },
      { new: true },
    );

    if (!update) {
      return res
        .status(404)
        .json({ success: true, message: "doctor update failed" });
    }

    return res.status(200).json({
      success: true,
      message: "doctor updated successfully",
      doctors: update,
    });
  } catch (error) {
    console.log("updateDoctor error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    if (!doctorId) {
      return res
        .status(401)
        .json({ success: false, message: "doctorId does not exist" });
    }

    const deleted = await doctorModel.findByIdAndDelete(doctorId);
    if (!deleted) {
      return res
        .status(401)
        .json({ success: false, message: "doctor deleted failed" });
    }

    return res.status(200).json({
      success: true,
      message: "doctor deleted successfully",
      doctors: deleted,
    });
  } catch (error) {
    console.log("deleteDoctor error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export { addDoctor, getAllDoctors, singleDoctor, updateDoctor, deleteDoctor };
