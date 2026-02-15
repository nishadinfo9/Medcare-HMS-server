import mongoose, { Schema } from "mongoose";

const doctorSchema = new Schema(
  {
    doctorName: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    shifts: [
      {
        day: {
          type: String,
          required: true,
        },
        startTime: {
          type: String,
          required: true,
        },
        endTime: {
          type: String,
          required: true,
        },
      },
    ],
    assignedPatients: [
      {
        type: Schema.Types.ObjectId,
        ref: "Patient",
      },
    ],
  },
  { timestamps: true },
);

export const doctorModel = mongoose.model("Doctor", doctorSchema);
