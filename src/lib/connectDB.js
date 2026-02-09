import mongoose from "mongoose";

export async function connectDB() {
  try {
    const response = await mongoose.connect(process.env.URI);
    console.log("Database connected successfully", response.connection.host);
  } catch (error) {
    console.log("Database connection failed", error);
  }
}
