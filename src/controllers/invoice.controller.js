import { InvoiceModel } from "../models/invoice.model.js";
import { ServiceModel } from "../models/service.model.js";

const createInvoice = async (req, res) => {
  try {
    const {
      patientId,
      appointmentId,
      serviceIds = [],
      partialpaidAmount = 0,
    } = req.body;

    if (
      !patientId ||
      !appointmentId ||
      !serviceIds.length ||
      !partialpaidAmount
    ) {
      return res.status(401).json({
        success: false,
        message: "Patient, appointment, and at least one service are required",
      });
    }

    const serviceFromDB = await ServiceModel.find({
      _id: { $in: serviceIds },
      isActive: true,
    });

    if (serviceFromDB.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "No valid services found" });
    }

    const invoiceServices = serviceFromDB.map((service) => ({
      serviceIds: service._id,
      name: service.name,
      price: service.price,
    }));

    const totalAmount = invoiceServices.reduce(
      (sum, service) => sum + service.price,
      0,
    );

    let paymentStatus = "pending";
    if (partialpaidAmount >= totalAmount) paymentStatus = "paid";

    const invoice = await InvoiceModel.create({
      patientId,
      appointmentId,
      services: invoiceServices,
      totalAmount,
      paymentStatus,
      partialpaidAmount,
    });

    if (!invoice) {
      return res.status(401).json({});
    }
  } catch (error) {
    console.log("createInvoice error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export { createInvoice };
