import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CarService } from './car.service';
import { verifyToken } from './car.utils';
import mongoose from 'mongoose';

const createACar = catchAsync(async (req, res) => {
  const decoded = verifyToken(req);
  if (decoded == null) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Use a valid token...');
  }

  const result = await CarService.createACar(req.body, decoded);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Car created successfully!',
    data: {
      result,
    },
  });
});

const getAllCars = catchAsync(async (req, res) => {
  const decoded = verifyToken(req);
  if (decoded == null) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Use a valid token...');
  }

  const result = await CarService.getAllCars(decoded);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:
      result.length === 0 ? 'No car found!' : 'Cars retrieved successfully!',
    data: {
      result,
    },
  });
});
const getSingleCar = catchAsync(async (req, res) => {
  const { id } = req.params;

  // Check if id is a valid ObjectId
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid ObjectId');
  }

  const objectId = new mongoose.Types.ObjectId(id); // Convert id to ObjectId
  const decoded = verifyToken(req);
  if (decoded == null) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Use a valid token...');
  }

  const result = await CarService.getSingleCar(decoded, objectId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Car retrieved successfully',
    data: {
      result,
    },
  });
});

const updateSingleCar = catchAsync(async (req, res) => {
  const { id } = req.params;

  // Check if id is a valid ObjectId
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid ObjectId');
  }

  const objectId = new mongoose.Types.ObjectId(id); // Convert id to ObjectId
  const decoded = verifyToken(req);
  if (decoded == null) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Use a valid token...');
  }

  const result = await CarService.updateSingleCar(decoded, objectId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Car updated successfully',
    data: {
      result,
    },
  });
});

export const carControllers = {
  createACar,
  getAllCars,
  getSingleCar,
  updateSingleCar,
};
