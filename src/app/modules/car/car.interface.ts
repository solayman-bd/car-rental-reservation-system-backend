import mongoose, { Document } from 'mongoose';
export default interface ICar extends Document {
  name: string;
  description: string;
  color: string;
  isElectric: boolean;
  features: string[];
  pricePerHour: number;
  isDeleted: boolean;
  status: 'available' | 'unavailable';
}
export interface IReturn {
  bookingId: string;
  endTime: string;
}
