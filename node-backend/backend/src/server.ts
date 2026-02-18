import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route";
import adminRoutes from "./routes/admin.route";
import { connectDB } from "./config/db";

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy is useful if you are deploying to platforms like Heroku/Render
app.set("trust proxy", 1);

// CORS configuration - ensure your React CLIENT_URL is set in .env
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Cache-Control", "Pragma"]
}));

app.use(express.json());

// --- Mount Clean Routes ---
app.use("/api/auth", authRoutes);   // Handles login/register/validate
app.use("/api/admin", adminRoutes); // Handles user management/dashboard

// --- Database Connection & Server Start ---
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\x1b[32m%s\x1b[0m`, `🚀 Server running on port ${PORT}`);
    console.log(`\x1b[33m%s\x1b[0m`, `✅ Auth & Admin modules active`);
  });
}).catch(err => {
  console.error("❌ Failed to start server:", err);
});