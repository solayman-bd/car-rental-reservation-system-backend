import { Request } from 'express';
import httpStatus from 'http-status';
import AppError from '../errors/AppError';
import { verifyToken } from './verifyToken';

// Utility function to verify token and extract decoded token
export const decodeToken = (req: Request) => {
  const decoded = verifyToken(req);
  if (!decoded) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Use a valid token...');
  }
  return decoded;
};
