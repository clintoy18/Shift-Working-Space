import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  userId: string;
  email: string;
  password?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  role: "shifty" | "cashier" | "admin";
  membershipType: string;
  membershipStatus: string;
  isVerified: boolean;
  isDeleted: boolean;
  fullName: string;
}

const UserSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, unique: true, maxlength: 20 },
    email: { type: String, required: true, unique: true, maxlength: 150 },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    role: { 
      type: String, 
      required: true, 
      enum: ["shifty", "cashier", "admin"], 
      default: "shifty" 
    },
    membershipType: { type: String, default: "None" },
    membershipStatus: { type: String, default: "Inactive" },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { 
    timestamps: true,
    toJSON: { 
      virtuals: true,
      transform: (doc, ret) => {
        const userObj = ret as any;
        delete userObj.password;
        return userObj;
      }
    }
  }
);

UserSchema.virtual('fullName').get(function(this: IUser) {
  return `${this.firstName} ${this.middleName ? this.middleName + ' ' : ''}${this.lastName}`.trim();
});

const User = mongoose.model<IUser>("User", UserSchema);
export default User;