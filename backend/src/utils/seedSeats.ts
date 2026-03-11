import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Seat, { ISeat } from '../models/Seat'; // Import the interface too

dotenv.config();

//  Type the array here to fix ts(7034)
const seats: Partial<ISeat>[] = []; // The "proper" TypeScript way

// 1. ISLAND TABLES (16 seats: 4 tables × 4 seats)
for (let i = 1; i <= 16; i++) {
    const tableNum = Math.floor((i - 1) / 4) + 1;
    const isLeftSide = (i - 1) % 4 < 2;
    const sideCode = isLeftSide ? "L" : "R";
    const seatInSide = (i - 1) % 2; // 0 or 1

    seats.push({
        seatNumber: `S-${i.toString().padStart(3, '0')}`,
        seatCode: `isl-${tableNum}-${sideCode}-${seatInSide}`,
        displayLabel: `R${i}`,
        seatType: "regular",
        status: "available",
        location: `Floor 1, Central Area, Island Table ${tableNum}, ${isLeftSide ? 'Left' : 'Right'} Side`,
        zoneType: "island",
        hourlyRate: 60,
        dailyRate: 480,
    });
}

// 2. WALL SEATS (5 seats)
const wallStartId = 17;
const wallLabels = ["R20", "R21", "R22", "R23", "R24"];
wallLabels.forEach((label, index) => {
    const id = wallStartId + index;
    seats.push({
        seatNumber: `S-${id.toString().padStart(3, '0')}`,
        seatCode: `wall-3-${index}`,
        displayLabel: label,
        seatType: "regular",
        status: "available",
        location: `Floor 1, East Wall, Position ${index + 1}`,
        zoneType: "wall",
        hourlyRate: 60,
        dailyRate: 480,
    });
});

// 3. REGULAR TABLES (6 seats)
const regularStartId = 22;
const regularData = [
    { code: "huddle-2-L-2", label: "R28", side: "Left" },
    { code: "huddle-2-L-1", label: "R29", side: "Left" },
    { code: "huddle-2-L-0", label: "R30", side: "Left" },
    { code: "huddle-2-R-2", label: "R25", side: "Right" },
    { code: "huddle-2-R-1", label: "R26", side: "Right" },
    { code: "huddle-2-R-0", label: "R27", side: "Right" },
];

regularData.forEach((data, index) => {
    const id = regularStartId + index;
    seats.push({
        seatNumber: `S-${id.toString().padStart(3, '0')}`,
        seatCode: data.code,
        displayLabel: data.label,
        seatType: "regular",
        status: "available",
        location: `Floor 1, North Wing, Regular Table, ${data.side} Side`,
        zoneType: "regular",
        hourlyRate: 60,
        dailyRate: 480,
    });
});

// 4. FOCUS CUBICLES (4 seats)
const cubeStartId = 28;
for (let i = 0; i < 4; i++) {
    const id = cubeStartId + i;
    seats.push({
        seatNumber: `S-${id.toString().padStart(3, '0')}`,
        seatCode: `cube-${i}`,
        displayLabel: `C${i + 1}`,
        seatType: "premium",
        status: "available",
        location: `Floor 1, South Wing, Focus Cubicle ${i + 1}`,
        zoneType: "cubicle",
        hourlyRate: 30,
        dailyRate: 240,
    });
}

// 5. HUDDLE ROOMS (Meeting Rooms - 3 rooms)
const huddleRooms = [
    { code: "huddle-1", label: "Huddle 1", capacity: 4, hourlyRate: 270 },
    { code: "huddle-2-room", label: "Huddle 2", capacity: 4, hourlyRate: 270 },
    { code: "conference", label: "Conference", capacity: 8, hourlyRate: 420 },
];

huddleRooms.forEach((room, index) => {
    const id = 32 + index;
    seats.push({
        seatNumber: `S-${id.toString().padStart(3, '0')}`,
        seatCode: room.code,
        displayLabel: room.label,
        seatType: "premium",
        status: "available",
        location: `Floor 1, North Wing, ${room.label} Room`,
        zoneType: "huddle",
        hourlyRate: room.hourlyRate,
        dailyRate: room.hourlyRate * 8,
    });
});

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shift_db');
        console.log("🛠️ Connected to MongoDB...");

        // Clear existing seats collection to avoid Unique Constraint errors
        await Seat.deleteMany({});
        console.log("🧹 Cleared existing seats collection.");

        await Seat.insertMany(seats);
        console.log(`✅ Success: ${seats.length} seats migrated to Node.js!`);

        process.exit(0);
    } catch (err) {
        console.error("❌ Seeding failed:", err);
        process.exit(1);
    }
};

seedDatabase();