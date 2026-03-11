import mongoose, { Schema, Document } from "mongoose";

export interface IPricingOption {
  duration: number; // Duration in minutes (60, 120, 240, 480)
  label: string; // "1 Hour", "2 Hours", "Half Day", "Full Day"
  price: number; // Price for this duration
  isActive: boolean; // Enable/disable this option
}

export interface ISeat extends Document {
  seatNumber: string;
  seatCode: string; // e.g., "isl-1-L-0"
  displayLabel: string; // e.g., "R1"
  seatType: "regular" | "cubicle" | "meeting-room";
  status: "available" | "occupied" | "reserved" | "maintenance";
  location: string;
  zoneType: "island" | "wall" | "regular" | "cubicle" | "huddle";
  hourlyRate: number;
  dailyRate: number;
  pricingOptions: IPricingOption[];
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SeatSchema = new Schema(
  {
    seatNumber: { type: String, required: true, unique: true },
    seatCode: { type: String, required: true, unique: true },
    displayLabel: { type: String, required: true },
    seatType: {
      type: String,
      enum: ["regular", "cubicle", "meeting-room"],
      default: "regular",
    },
    status: {
      type: String,
      enum: ["available", "occupied", "reserved", "maintenance"],
      default: "available",
      index: true,
    },
    location: { type: String, required: true },
    zoneType: { type: String, required: true, index: true },
    hourlyRate: { type: Number, required: true },
    dailyRate: { type: Number, required: true },
    pricingOptions: [
      {
        duration: { type: Number, required: true }, // Minutes
        label: { type: String, required: true },
        price: { type: Number, required: true },
        isActive: { type: Boolean, default: true },
      },
    ],
    isActive: { type: Boolean, default: true, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
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
      },
    },
  },
);

export default mongoose.model<ISeat>("Seat", SeatSchema);
