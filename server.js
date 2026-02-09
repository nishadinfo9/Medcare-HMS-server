import { app } from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./src/lib/connectDB.js";
dotenv.config();

// const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

connectDB()
  .then(() => console.log("Database Connected Successfully"))
  .catch((error) => console.log("Database connection failed", error));

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });
