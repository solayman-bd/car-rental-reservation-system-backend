// import { Request } from 'express';
import jwt from 'jsonwebtoken';

import { IDecodedToken } from '../interface/tokenInterface';

export const verifyToken = (
  token: string,
  secret: string,
): IDecodedToken | null => {
  try {
    const decoded = jwt.verify(token, secret) as IDecodedToken;
    return decoded;
  } catch (error) {
    return null; // Token verification failed
  }
};
