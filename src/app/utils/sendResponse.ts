import { Response } from 'express';
import httpStatus from 'http-status';

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data: T;
  token?: string;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  if (data.token) {
    res.status(data?.statusCode).json({
      success: data.success,
      statusCode: data.statusCode,
      message: data.message,
      data: data.data,
      token: data.token,
    });
  } else {
    res.status(data?.statusCode).json({
      success: data.success,
      statusCode: data.statusCode,
      message: data.message,
      data: data.data,
    });
  }
};
export const sendNotFoundResponse = (res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    statusCode: httpStatus.NOT_FOUND,
    message: 'No data found',
    data: [],
  });
};

export default sendResponse;
