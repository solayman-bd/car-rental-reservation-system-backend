import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CarService } from './car.service';
import { authorize, validateObjectId, verifyToken } from './car.utils';
import mongoose from 'mongoose';

// Controller functions
const createACar = catchAsync(async (req, res) => {
  const decoded = authorize(req);
  const result = await CarService.createACar(req.body, decoded);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Car created successfully!',
    data: { result },
  });
});
const getAllCars = catchAsync(async (req, res) => {
  const decoded = authorize(req);
  const result = await CarService.getAllCars(decoded);
  const message =
    result.length === 0 ? 'No car found!' : 'Cars retrieved successfully!';
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message,
    data: { result },
  });
});

const getSingleCar = catchAsync(async (req, res) => {
  const { id } = req.params;
  validateObjectId(id);
  const objectId = new mongoose.Types.ObjectId(id); // Convert id to ObjectId
  const decoded = authorize(req);
  const result = await CarService.getSingleCar(decoded, objectId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Car retrieved successfully',
    data: { result },
  });
});

const updateSingleCar = catchAsync(async (req, res) => {
  const { id } = req.params;
  validateObjectId(id);
  const objectId = new mongoose.Types.ObjectId(id); // Convert id to ObjectId
  const decoded = authorize(req);
  const result = await CarService.updateSingleCar(decoded, objectId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Car updated successfully',
    data: { result },
  });
});

const deleteSingleCar = catchAsync(async (req, res) => {
  const { id } = req.params;
  validateObjectId(id);
  const objectId = new mongoose.Types.ObjectId(id); // Convert id to ObjectId
  const decoded = authorize(req);
  const result = await CarService.deleteSingleCar(decoded, objectId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Car deleted successfully',
    data: { result },
  });
});

export const carControllers = {
  createACar,
  getAllCars,
  getSingleCar,
  updateSingleCar,
  deleteSingleCar,
};
