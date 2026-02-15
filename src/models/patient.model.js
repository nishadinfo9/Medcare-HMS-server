import mongoose, { Schema } from "mongoose";

const patientScheme = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    patientName: {
      type: String,
      default: "",
    },
    age: {
      type: Number,
      default: 0,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    contact: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    medicalHistory: [
      {
        disease: {
          type: String,
          default: "",
        },
        notes: {
          type: String,
          default: "",
        },
        date: {
          type: Date,
          default: null,
        },
        doctorId: {
          type: Schema.Types.ObjectId,
          ref: "Doctor",
        },
      },
    ],
    assignedDoctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
    },
  },
  { timestamps: true },
);

export const PatientModel = mongoose.model("Patient", patientScheme);
