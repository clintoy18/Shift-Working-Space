import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route";
import adminRoutes from "./routes/admin.route";
import seatRoutes from "./routes/seat.routes";
import publicRoutes from "./routes/public.route";
import { connectDB } from "./config/db";
import { initializeRedis, closeRedis } from "./config/redis";

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
app.use("/api/public", publicRoutes); // Public endpoints (no auth required)
app.use("/api/auth", authRoutes);   // Handles login/register/validate
app.use("/api/admin", adminRoutes); // Handles user management/dashboard
app.use("/api/seat", seatRoutes ); // Handles user management/dashboard


// --- Database Connection & Server Start ---
const startServer = async () => {
  try {
    // Initialize Redis (optional, will fallback to memory store if unavailable)
    await initializeRedis();

    // Connect to MongoDB
    await connectDB();

    // Start Express server
    const server = app.listen(PORT, () => {
      // Server started
    });

    // Graceful shutdown
    process.on("SIGTERM", async () => {
      server.close(async () => {
        await closeRedis();
        process.exit(0);
      });
    });

    process.on("SIGINT", async () => {
      server.close(async () => {
        await closeRedis();
        process.exit(0);
      });
    });
  } catch (err) {
    process.exit(1);
  }
};

startServer();
