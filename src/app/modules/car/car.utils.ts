import { Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import { IDecodedToken } from './car.interface';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

export const verifyToken = (req: Request): IDecodedToken | null => {
  // Extract the token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null; // No Authorization header present
  }

  const token = authHeader.split(' ')[1]; // Splitting Bearer from the token

  try {
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as IDecodedToken;
    return decoded;
  } catch (error) {
    return null; // Token verification failed
  }
};
// Utility function to validate ObjectId
export const validateObjectId = (id: string) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid ObjectId');
  }
};
// Utility function to verify token and extract decoded token
export const authorize = (req: Request) => {
  const decoded = verifyToken(req);
  if (!decoded) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Use a valid token...');
  }
  return decoded;
};
