import mongoose, { Schema } from 'mongoose';
import { IBooking } from './booking.interface';

const bookingSchema = new Schema<IBooking>({
  carId: { type: Schema.Types.ObjectId, required: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, default: null },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  car: { type: Schema.Types.ObjectId, ref: 'Car' },
  totalCost: { type: Number, default: 0 },
});

const BookingModel = mongoose.model<IBooking>('Booking', bookingSchema);

export default BookingModel;
