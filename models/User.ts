import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'user' | 'admin';
  avatar: { url: string; publicId: string };
  isBanned: boolean;
  banReason: string;
  refreshToken: string;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, default: '' },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    avatar: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    isBanned: { type: Boolean, default: false },
    banReason: { type: String, default: '' },
    refreshToken: { type: String, default: '' },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

UserSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

if (mongoose.models.User) {
  delete mongoose.models.User;
}

const User = mongoose.model<IUser>('User', UserSchema);

export default User;