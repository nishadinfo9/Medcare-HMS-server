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

import userRouter from "./src/routes/user.route.js";
app.use("/api/v1", userRouter);
