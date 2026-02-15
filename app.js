import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
export const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.DEV_ORIGIN, process.env.PRODUCTION_ORIGIN],
    credentials: true,
  }),
);

// imports
import userRouter from "./src/routes/user.route.js";
import patientRouter from "./src/routes/patient.route.js";
import doctortRouter from "./src/routes/doctor.route.js";

// executions
app.use("/api/v1", userRouter);
app.use("/api/v1", patientRouter);
app.use("/api/v1", doctortRouter);
