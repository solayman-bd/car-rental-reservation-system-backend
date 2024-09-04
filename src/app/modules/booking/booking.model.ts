import mongoose, { Schema } from 'mongoose';
import { IBooking } from './booking.interface';
import { BOOKING_STATUS } from './booking.constant';

const bookingSchema = new Schema<IBooking>({
  carId: { type: Schema.Types.ObjectId, required: true },
  hiringDate: { type: String, required: true },
  returningDate: { type: String, required: false, default: null },
  startTime: { type: String, required: true },
  endTime: { type: String, default: null },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  car: { type: Schema.Types.ObjectId, ref: 'Car' },
  totalCost: { type: Number, default: 0 },
  status: {
    type: String,
    enum: [
      BOOKING_STATUS.approved,
      BOOKING_STATUS.pending,
      BOOKING_STATUS.cancelled,
      BOOKING_STATUS.returned,
    ],
    default: BOOKING_STATUS.pending,
  },
  additionalFeatures: { type: [String], required: false },
  startLocation: { type: String, required: true },
  isPaid: { type: Boolean, required: false, default: false },
  drivingLicense: { type: String, required: true },
  nid: { type: String, required: true },
});

const BookingModel = mongoose.model<IBooking>('Booking', bookingSchema);

export default BookingModel;
