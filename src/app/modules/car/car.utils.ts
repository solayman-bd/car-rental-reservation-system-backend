import { Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import { IDecodedToken } from './car.interface';

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
