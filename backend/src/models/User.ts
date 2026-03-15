import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  password?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  fullName: string;
  role: "shifty" | "cashier" | "admin";
  membershipType: string;
  membershipStatus: string;
  isVerified: boolean;
  isDeleted: boolean;
  termsAccepted: boolean;
  privacyPolicyAccepted: boolean;
  agreementAcceptedAt?: Date;
  // OAuth fields
  googleId?: string;
  googleEmail?: string;
  authProvider: "email" | "google";
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true, maxlength: 150 },
    password: { type: String },
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["shifty", "cashier", "admin"],
      default: "shifty",
    },
    membershipType: { type: String, default: "None" },
    membershipStatus: { type: String, default: "Inactive" },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    termsAccepted: { type: Boolean, required: true, default: false },
    privacyPolicyAccepted: { type: Boolean, required: true, default: false },
    agreementAcceptedAt: { type: Date },
    // OAuth fields
    googleId: { type: String, sparse: true },
    googleEmail: { type: String, sparse: true },
    authProvider: { 
      type: String, 
      enum: ["email", "google"], 
      default: "email" 
    },
  },
  { 
    timestamps: true,
    toJSON: { 
      virtuals: true,
      transform: (doc, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      }
    }
  }
);

UserSchema.virtual('fullName').get(function(this: IUser) {
  return `${this.firstName} ${this.middleName ? this.middleName + ' ' : ''}${this.lastName}`.trim();
});

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
