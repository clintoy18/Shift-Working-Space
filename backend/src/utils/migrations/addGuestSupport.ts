/**
 * Migration Script: Add Guest Support to Check-In System
 *
 * This script adds the following fields to the CheckIn collection:
 * - guest: Optional reference to Guest model
 * - checkInType: "registered" or "guest"
 * - allocatedDurationMinutes: Duration guest paid for
 * - warningThresholdMinutes: When to warn cashier
 * - extensionHistory: Array of extensions
 * - penaltyCharges: Array of penalties
 * - status: "active" | "warning" | "overtime" | "completed"
 *
 * And to the Reservation collection:
 * - guest: Optional reference to Guest model
 * - reservationType: "registered" or "guest"
 *
 * Usage: npx ts-node src/utils/migrations/addGuestSupport.ts
 */

import mongoose from "mongoose";
import { connectDB } from "../../config/db";

const runMigration = async () => {
  try {
    console.log("🔄 Starting migration: Add Guest Support...");

    // Connect to database
    await connectDB();
    console.log("✅ Connected to database");

    const db = mongoose.connection.db;

    if (!db) {
      throw new Error("Database connection failed");
    }

    // --- CheckIn Collection Migrations ---
    console.log("\n📝 Migrating CheckIn collection...");

    // Add guest field
    await db.collection("checkins").updateMany(
      {},
      {
        $set: {
          guest: null,
          checkInType: "registered",
          allocatedDurationMinutes: 0,
          warningThresholdMinutes: 5,
          extensionHistory: [],
          penaltyCharges: [],
          status: "completed",
        },
      }
    );
    console.log("✅ Added guest support fields to CheckIn");

    // Create indexes for performance
    await db.collection("checkins").createIndex({ status: 1, allocatedDurationMinutes: 1 });
    await db.collection("checkins").createIndex({ checkInType: 1, checkInTime: -1 });
    await db.collection("checkins").createIndex({ status: 1 });
    await db.collection("checkins").createIndex({ checkInType: 1 });
    console.log("✅ Created indexes on CheckIn collection");

    // --- Reservation Collection Migrations ---
    console.log("\n📝 Migrating Reservation collection...");

    // Add guest field
    await db.collection("reservations").updateMany(
      {},
      {
        $set: {
          guest: null,
          reservationType: "registered",
        },
      }
    );
    console.log("✅ Added guest support fields to Reservation");

    // Create indexes
    await db.collection("reservations").createIndex({ reservationType: 1 });
    await db.collection("reservations").createIndex({ status: 1 });
    console.log("✅ Created indexes on Reservation collection");

    // --- Seat Collection Migrations ---
    console.log("\n📝 Migrating Seat collection...");

    // Add pricingOptions field if not exists
    const seatCount = await db.collection("seats").countDocuments({
      pricingOptions: { $exists: false },
    });

    if (seatCount > 0) {
      await db.collection("seats").updateMany(
        { pricingOptions: { $exists: false } },
        {
          $set: {
            pricingOptions: [
              {
                duration: 60,
                label: "1 Hour",
                price: 15,
                isActive: true,
              },
              {
                duration: 120,
                label: "2 Hours",
                price: 25,
                isActive: true,
              },
              {
                duration: 240,
                label: "Half Day (4 Hours)",
                price: 40,
                isActive: true,
              },
              {
                duration: 480,
                label: "Full Day (8 Hours)",
                price: 60,
                isActive: true,
              },
            ],
          },
        }
      );
      console.log(`✅ Added default pricing options to ${seatCount} seats`);
    } else {
      console.log("✅ All seats already have pricing options");
    }

    // Create indexes
    await db.collection("seats").createIndex({ status: 1 });
    await db.collection("seats").createIndex({ zoneType: 1 });
    await db.collection("seats").createIndex({ isActive: 1 });
    await db.collection("seats").createIndex({ isDeleted: 1 });
    console.log("✅ Created indexes on Seat collection");

    console.log("\n✅ Migration completed successfully!");
    console.log("\n📊 Summary:");
    console.log("   - CheckIn collection: Added guest support fields");
    console.log("   - Reservation collection: Added guest support fields");
    console.log("   - Seat collection: Added pricing options");
    console.log("   - Created performance indexes");

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
};

// Run migration
runMigration();
