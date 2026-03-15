import mongoose, { Schema, Document } from "mongoose";

export interface IReservation extends Document {
  user?: mongoose.Types.ObjectId;
  guest?: mongoose.Types.ObjectId;
  reservationType: "registered" | "guest";
  seat: mongoose.Types.ObjectId;
  reservationDate: Date;
  startTime: string; // HH:mm format
  endTime: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReservationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    guest: { type: Schema.Types.ObjectId, ref: "Guest" },
    reservationType: {
      type: String,
      enum: ["registered", "guest"],
      required: true,
      index: true,
    },
    seat: { type: Schema.Types.ObjectId, ref: "Seat", required: true },
    reservationDate: { type: Date, required: true, index: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
      index: true,
    },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Validation: At least one of user or guest must be present
ReservationSchema.pre("save", function (next) {
  if (!this.user && !this.guest) {
    return next(new Error("Reservation must have either a user or guest"));
  }
  next();
});

export default mongoose.model<IReservation>("Reservation", ReservationSchema);