import { Request } from 'express';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import { verifyToken } from './verifyToken';
import config from '../config';

export const extractToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null; // No Authorization header present or invalid format
  }
  return authHeader.split(' ')[1]; // Extracting the token
};

export const handleTokenFromRequest = (req: Request) => {
  const token = extractToken(req);
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Use a valid token...');
  }
  const decoded = verifyToken(token, config.jwt_access_secret as string);
  if (!decoded) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Use a valid token...');
  }
  return decoded;
};
