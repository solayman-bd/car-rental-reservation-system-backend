import { Request, Response, NextFunction } from 'express';
import { decodeToken } from './decodeToken';
import httpStatus from 'http-status';

const authGuard =
  (requiredRole: string = '') =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, role } = decodeToken(req);

      if (requiredRole != '' && requiredRole !== role) {
        return res.status(httpStatus.UNAUTHORIZED).json({
          success: false,
          statusCode: httpStatus.UNAUTHORIZED,
          message: 'You have no access to this route',
        });
      }
      req.user = { userId, role };

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      next(error); // Pass any error to the error handler middleware
    }
  };

export default authGuard;
