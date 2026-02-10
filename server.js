import { app } from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./src/lib/connectDB.js";
dotenv.config();

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.get("/health", (req, res) => {
  res.json({message: 'good'})
});

connectDB()
  .then(() =>
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    }),
  )
  .catch((err) => {
    console.log("Database faild", err);
    process.exit(1);
  });
