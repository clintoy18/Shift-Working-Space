import mongoose, { Schema, Document } from "mongoose";

export interface IGuest extends Document {
  // Auto-generated guest ID (e.g., "GUEST-001", "GUEST-002")
  guestId: string;

  // Optional contact info (for follow-up/receipts)
  email?: string;
  phoneNumber?: string;

  // Metadata
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GuestSchema = new Schema(
  {
    guestId: { type: String, required: true, unique: true, index: true },
    email: { type: String, sparse: true },
    phoneNumber: { type: String, sparse: true },
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

// Auto-generate guestId before validation (runs before save)
GuestSchema.pre("validate", async function (next) {
  // Only generate if this is a new document and guestId is not already set
  if (!this.isNew || this.guestId) {
    return next();
  }

  try {
    // Find the highest guest number
    const Guest = mongoose.model<IGuest>("Guest");
    const lastGuest = await Guest
      .findOne({})
      .sort({ createdAt: -1 })
      .lean();

    let nextNumber = 1;
    if (lastGuest && lastGuest.guestId) {
      const match = lastGuest.guestId.match(/GUEST-(\d+)/);
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }

    this.guestId = `GUEST-${String(nextNumber).padStart(3, "0")}`;
    next();
  } catch (error) {
    next(error as Error);
  }
});

export default mongoose.model<IGuest>("Guest", GuestSchema);
