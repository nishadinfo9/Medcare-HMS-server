import mongoose, { Schema } from "mongoose";

const invoiceSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
    },
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
    },
    services: [
      {
        name: {
          type: String,
          default: "",
        },
        price: {
          type: Number,
          default: 0,
        },
      },
    ],
    totalAmount: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    partialpaidAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: null },
);

export const InvoiceModel = mongoose.model("Invoice", invoiceSchema);
