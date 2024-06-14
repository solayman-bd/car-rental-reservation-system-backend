import { Request, Response, NextFunction } from 'express';
import AppError from '../errors/AppError';
import { decodeToken } from './decodeToken';

const authGuard =
  (requiredRole: string = '') =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, role } = decodeToken(req);

      if (requiredRole != '' && requiredRole !== role) {
        throw new AppError(
          403,
          `Resources are not accessible to ${role}. Required role is ${requiredRole}`,
        );
      }
      req.user = { userId, role };

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      next(error); // Pass any error to the error handler middleware
    }
  };

export default authGuard;
