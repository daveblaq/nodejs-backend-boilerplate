import { Schema, model } from 'mongoose';
import { IUser, IUserModel } from '../interfaces/user.interface';
import { UserTypes } from '../enums/user';

const UserSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    country: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      trim: true,
    },
    otp: {
      type: String,
      select: false,
    },
    otpExpiresAt: {
      type: Date,
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(UserTypes),
      default: UserTypes.USER,
    },
    isVIP: {
      type: Boolean,
      default: false,
    },
    vipType: {
      type: String,
      default: 'none',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Static methods
UserSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

const User = model<IUser, IUserModel>('User', UserSchema);

export default User;