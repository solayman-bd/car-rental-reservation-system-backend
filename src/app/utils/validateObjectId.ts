import mongoose from 'mongoose';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
// Utility function to validate ObjectId
export const validateObjectId = (id: string): mongoose.Types.ObjectId => {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid ObjectId');
  }
  return new mongoose.Types.ObjectId(id);
};
