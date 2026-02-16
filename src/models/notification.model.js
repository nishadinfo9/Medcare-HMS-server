import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        "APPOINTMENT_CREATED",
        "APPOINTMENT_CANCELLED",
        "PAYMENT_SUCCESS",
        "PAYMENT_DUE",
        "DOCTOR_ASSIGNED",
        "REPORT_READY",
        "SYSTEM_ALERT",
      ],
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const NotificationModel = mongoose.model(
  "Notification",
  notificationSchema,
);
