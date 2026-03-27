import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL || process.env.MONGO_ATLAS_URL;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log(MONGO_URL)
    console.log("MongoDB Connected ✅");
  } catch (err) {
    console.log("MongoDB error, retrying...");
    setTimeout(connectDB, 5000);
  }
};

connectDB();

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running http://localhost:${PORT}`);
});
