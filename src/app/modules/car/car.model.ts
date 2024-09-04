import mongoose, { Schema } from 'mongoose';
import ICar from './car.interface';

// Define the schema for the Car model
const carSchema = new Schema<ICar>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  color: { type: String, required: true },
  isElectric: { type: Boolean, required: true },
  basicFeatures: { type: [String], required: true },
  additionalFeatures: {
    type: [{ name: String, feePerHour: Number }],
    required: false,
  },
  pricePerHour: { type: Number, required: true },
  isDeleted: { type: Boolean, default: false },
  status: {
    type: String,
    default: 'available',
    enum: ['available', 'unavailable'],
  },
  isCurrentlyHired: { type: Boolean, default: false },
  locationWhereAvailable: { type: [String], required: true },
  img: { type: [String], required: false },
  isFeatured: { type: Boolean, required: false, default: false },
});

// Create and export the Car model
const CarModel = mongoose.model<ICar>('Car', carSchema);

export default CarModel;
