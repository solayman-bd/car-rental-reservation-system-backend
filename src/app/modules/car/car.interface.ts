import mongoose, { Document } from 'mongoose';
export default interface ICar extends Document {
  name: string;
  description: string;
  color: string;
  isElectric: boolean;
  basicFeatures: string[];
  additionalFeatures: {
    name: string;
    feePerHour: number;
  }[];
  pricePerHour: number;
  isDeleted: boolean;
  status: 'available' | 'unavailable';
  isCurrentlyHired: boolean;
  locationWhereAvailable: string[];
}
export interface IReturn {
  bookingId: mongoose.Types.ObjectId;
  endTime: string;
  returningDate: string;
}
