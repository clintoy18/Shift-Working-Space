import mongoose, { Schema, Document } from "mongoose";

export interface ISeat extends Document {
  seatNumber: string;
  seatCode: string; // e.g., "isl-1-L-0"
  displayLabel: string; // e.g., "R1"
  seatType: "regular" | "premium";
  status: "available" | "occupied" | "reserved" | "maintenance";
  location: string;
  zoneType: "island" | "wall" | "regular" | "cubicle";
  hourlyRate: number;
  dailyRate: number;
  isActive: boolean;
  isDeleted: boolean;
}

const SeatSchema = new Schema(
  {
    seatNumber: { type: String, required: true, unique: true },
    seatCode: { type: String, required: true, unique: true },
    displayLabel: { type: String, required: true },
    seatType: { type: String, enum: ["regular", "premium"], default: "regular" },
    status: { type: String, enum: ["available", "occupied", "reserved", "maintenance"], default: "available" },
    location: { type: String, required: true },
    zoneType: { type: String, required: true },
    hourlyRate: { type: Number, required: true },
    dailyRate: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { 
    timestamps: true,
    toJSON: { 
      virtuals: true,
      // ✅ Use 'any' for ret to avoid the complex Mongoose FlatRecord mismatch
      transform: (_doc, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

export default mongoose.model<ISeat>("Seat", SeatSchema);