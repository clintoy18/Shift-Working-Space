import mongoose, { Schema, Document } from "mongoose";

export interface ICheckIn extends Document {
  user?: mongoose.Types.ObjectId;
  guest?: mongoose.Types.ObjectId;
  checkInType: "registered" | "guest";
  seat: mongoose.Types.ObjectId;
  reservation?: mongoose.Types.ObjectId;
  checkInTime: Date;
  checkOutTime?: Date;
  durationMinutes?: number;
  processedBy: string;
  paymentStatus: "pending" | "paid" | "refunded";
  paymentAmount: number;
  allocatedDurationMinutes: number;
  warningThresholdMinutes: number;
  status: "active" | "warning" | "overtime" | "completed";
  extensionHistory: Array<{
    addedMinutes: number;
    addedAmount: number;
    appliedAt: Date;
    appliedBy: string;
  }>;
  penaltyCharges: Array<{
    amount: number;
    reason: string;
    appliedAt: Date;
    appliedBy: string;
  }>;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CheckInSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    guest: { type: Schema.Types.ObjectId, ref: "Guest" },
    checkInType: {
      type: String,
      enum: ["registered", "guest"],
      required: true,
      index: true,
    },
    seat: { type: Schema.Types.ObjectId, ref: "Seat", required: true },
    reservation: { type: Schema.Types.ObjectId, ref: "Reservation" },
    checkInTime: { type: Date, default: Date.now, index: true },
    checkOutTime: { type: Date },
    durationMinutes: { type: Number },
    processedBy: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },
    paymentAmount: { type: Number, default: 0 },
    allocatedDurationMinutes: { type: Number, required: true, index: true },
    warningThresholdMinutes: { type: Number, default: 5 },
    status: {
      type: String,
      enum: ["active", "warning", "overtime", "completed"],
      default: "active",
      index: true,
    },
    extensionHistory: [
      {
        addedMinutes: { type: Number, required: true },
        addedAmount: { type: Number, required: true },
        appliedAt: { type: Date, default: Date.now },
        appliedBy: { type: String, required: true },
      },
    ],
    penaltyCharges: [
      {
        amount: { type: Number, required: true },
        reason: { type: String, required: true },
        appliedAt: { type: Date, default: Date.now },
        appliedBy: { type: String, required: true },
      },
    ],
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

// Validation: Ensure checkInType matches the actual reference
CheckInSchema.pre("save", function (next) {
  // Must have either user or guest (but not both)
  if (!this.user && !this.guest) {
    return next(new Error("CheckIn must have either a user or guest"));
  }

  if (this.user && this.guest) {
    return next(new Error("CheckIn cannot have both user and guest references"));
  }

  // checkInType must match the reference
  if (this.checkInType === "registered" && !this.user) {
    return next(new Error("Registered check-in must have a user reference"));
  }

  if (this.checkInType === "guest" && !this.guest) {
    return next(new Error("Guest check-in must have a guest reference"));
  }

  next();
});

// Create indexes for performance
CheckInSchema.index({ status: 1, allocatedDurationMinutes: 1 });
CheckInSchema.index({ checkInType: 1, checkInTime: -1 });

export default mongoose.model<ICheckIn>("CheckIn", CheckInSchema);