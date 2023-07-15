dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";
import noteRouter from "./routes/notes.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

(async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
    console.log("DB Connected");
  } catch (error) {
    console.log(error.message);
  }
})();


app.use("/api/auth", authRouter);
app.use("/api/note", noteRouter);

app.listen(PORT, () =>
  console.log(`Server running on http://127.0.0.1:${process.env.PORT}`)
);
