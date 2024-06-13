import { Document } from 'mongoose';
export default interface IUser extends Document {
  name: string;
  email: string;
  role: 'user' | 'admin';
  password: string;
  phone: string;
  address: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
