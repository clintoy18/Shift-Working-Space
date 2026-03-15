import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route";
import oauthRoutes from "./routes/oauth.route";
import adminRoutes from "./routes/admin.route";
import seatRoutes from "./routes/seat.routes";
import publicRoutes from "./routes/public.route";
import checkInRoutes from "./routes/checkin.routes";
import { connectDB } from "./config/db";
import { initializeRedis, closeRedis } from "./config/redis";
import { honeypot } from "./middleware/botDetection.middleware";

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
app.use("/api/auth", oauthRoutes);  // Handles Google OAuth
app.use("/api/admin", adminRoutes); // Handles user management/dashboard
app.use("/api/seat", seatRoutes ); // Handles seat management
app.use("/api/checkin", checkInRoutes); // Handles check-in/check-out

// --- Honeypot Endpoints (catch aggressive scrapers) ---
app.get("/api/admin/all-users", honeypot);
app.get("/api/admin/export", honeypot);
app.get("/api/admin/backup", honeypot);
app.get("/admin/users", honeypot);
app.get("/admin/export", honeypot);


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
