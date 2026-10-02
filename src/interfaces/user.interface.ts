import { Document, Model } from 'mongoose';
import { UserTypes } from '../enums/user';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  avatar?: string;
  otp?: string;
  otpExpiresAt?: Date;
  role?: UserTypes;
  isVIP?: boolean;
  vipType?: string;
  isEmailVerified?: boolean;
  status?: boolean;
}

export interface IUserModel extends Model<IUser> {
  isEmailTaken(email: string, excludeUserId?: any): Promise<boolean>;
}

export interface AuthResult {
  status: number;
  message: string;
  token?: string;
  data?: any;
}