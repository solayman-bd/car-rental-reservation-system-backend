import { JwtPayload } from 'jsonwebtoken';
import { Document } from 'mongoose';
export default interface ICar extends Document {
  name: string;
  description: string;
  color: string;
  isElectric: boolean;
  features: string[];
  pricePerHour: number;
  isDeleted: boolean;
  status: 'available' | 'not available';
}

export interface IDecodedToken extends JwtPayload {
  userId: string;
  role: 'admin' | 'user';
}
