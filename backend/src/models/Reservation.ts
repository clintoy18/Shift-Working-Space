import mongoose, { Schema, Document } from "mongoose";

export interface IReservation extends Document {
  user: mongoose.Types.ObjectId;
  seat: mongoose.Types.ObjectId;
  reservationDate: Date;
  startTime: string; // HH:mm format
  endTime: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  isDeleted: boolean;
}

const ReservationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    seat: { type: Schema.Types.ObjectId, ref: "Seat", required: true },
    reservationDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    status: { 
      type: String, 
      enum: ["pending", "confirmed", "cancelled", "completed"], 
      default: "pending" 
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IReservation>("Reservation", ReservationSchema);