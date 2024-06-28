import { NextFunction, Request, Response, ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import config from '../config';
import AppError from '../errors/AppError';
import handleCastError from '../errors/handleCastError';
import handleDuplicateError from '../errors/handleDuplicateError';
import handleValidationError from '../errors/handleValidationError';
import handleZodError from '../errors/handleZodError';
import { TErrorMessages } from '../interface/error';

const globalErrorHandler: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Setting default values
  let statusCode = 500;
  let message = 'Something went wrong!';
  let errorMessages: TErrorMessages = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ];

  // Handling specific error types
  if (err instanceof ZodError) {
    const {
      statusCode: sc,
      message: msg,
      errorMessages: es,
    } = handleZodError(err);
    statusCode = sc;
    message = msg;
    errorMessages = es;
  } else if (err?.name === 'ValidationError') {
    const {
      statusCode: sc,
      message: msg,
      errorMessages: es,
    } = handleValidationError(err);
    statusCode = sc;
    message = msg;
    errorMessages = es;
  } else if (err?.name === 'CastError') {
    const {
      statusCode: sc,
      message: msg,
      errorMessages: es,
    } = handleCastError(err);
    statusCode = sc;
    message = msg;
    errorMessages = es;
  } else if (err?.code === 11000) {
    const {
      statusCode: sc,
      message: msg,
      errorMessages: es,
    } = handleDuplicateError(err);
    statusCode = sc;
    message = msg;
    errorMessages = es;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorMessages = [
      {
        path: '',
        message: err.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err.message;
    errorMessages = [
      {
        path: '',
        message: err.message,
      },
    ];
  }

  // Sending error response
  return res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.NODE_ENV === 'development' ? err.stack : null,
  });
};

export default globalErrorHandler;
