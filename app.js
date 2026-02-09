import express from "express";
import cookieParser from "cookie-parser";
export const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./src/routes/user.route.js";
app.use("/api/v1", userRouter);
