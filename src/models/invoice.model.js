import mongoose, { Schema } from "mongoose";

const invoiceSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    services: [
      {
        serviceIds: {
          type: Schema.Types.ObjectId,
          ref: "Service",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
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
      min: 0,
    },
  },
  { timestamps: true },
);

invoiceSchema.pre("save", function () {
  this.totalAmount = this.services.reduce(
    (sum, service) => sum + service.price,
    0,
  );
});

export const InvoiceModel = mongoose.model("Invoice", invoiceSchema);
