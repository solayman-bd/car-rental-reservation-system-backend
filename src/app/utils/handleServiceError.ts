import httpStatus from 'http-status';
import AppError from '../errors/AppError';

// Utility function for error handling
export const handleServiceError = (err: unknown): never => {
  if (err instanceof AppError) {
    throw err;
  } else {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal Server Error',
    );
  }
};
