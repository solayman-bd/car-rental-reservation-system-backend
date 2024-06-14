import mongoose, { Schema } from 'mongoose';
import ICar from './car.interface';
// Define the schema for the Car model
const carSchema = new Schema<ICar>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  color: { type: String, required: true },
  isElectric: { type: Boolean, required: true },
  features: { type: [String], required: true },
  pricePerHour: { type: Number, required: true },
  isDeleted: { type: Boolean, default: false },
  status: {
    type: String,
    default: 'available',
    enum: ['available', 'unavailable'],
  },
});

// Create and export the Car model
const CarModel = mongoose.model<ICar>('Car', carSchema);

export default CarModel;
