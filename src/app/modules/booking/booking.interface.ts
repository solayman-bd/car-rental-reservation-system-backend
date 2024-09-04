import mongoose from 'mongoose';
import IUser from '../user/user.interface';
import ICar from '../car/car.interface';
import { TBookingStatus } from './booking.constant';

export interface IBooking {
  carId: mongoose.Types.ObjectId;
  hiringDate: string; // Assuming date format is YYYY-MM-DD
  returningDate: string; // Assuming date format is YYYY-MM-DD
  startTime: string; // Assuming time format is HH:mm
  endTime: string | null; // Will be null by default and updated by admin
  user: mongoose.Types.ObjectId | IUser; // Either ObjectId or populated IUser
  car: mongoose.Types.ObjectId | ICar; // Either ObjectId or populated ICar
  totalCost: number; // Will be 0 by default and updated by admin
  status: TBookingStatus;
  additionalFeatures: string[];
  startLocation: string;
  isPaid: boolean;
  drivingLicense: string;
  nid: string;
}
