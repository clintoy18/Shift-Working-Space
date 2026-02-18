import mongoose, { Schema, Document } from "mongoose";

const CheckInSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    seat: { type: Schema.Types.ObjectId, ref: "Seat", required: true },
    reservation: { type: Schema.Types.ObjectId, ref: "Reservation" },
    checkInTime: { type: Date, default: Date.now },
    checkOutTime: { type: Date },
    durationMinutes: { type: Number },
    processedBy: { type: String, required: true }, // Name/ID of cashier
    paymentStatus: { type: String, enum: ["pending", "paid", "refunded"], default: "pending" },
    paymentAmount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("CheckIn", CheckInSchema);