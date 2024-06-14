import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { carService } from './car.service';
import { decodeToken } from '../../utils/decodeToken';
import { validateObjectId } from '../../utils/validateObjectId';
import { Response, Request } from 'express';

// Controller functions
const createACar = catchAsync(async (req, res) => {
  const result = await carService.createACar(req.body, req.user.userId);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Car created successfully!',
    data: { result },
  });
});
const getAllCars = catchAsync(async (req, res) => {
  const result = await carService.getAllCars(req.user.userId, req.user.role);
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
  const objectId = validateObjectId(id);

  const result = await carService.getSingleCar(
    req.user.userId,
    req.user.role,
    objectId,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Car retrieved successfully',
    data: { result },
  });
});

const updateSingleCar = catchAsync(async (req, res) => {
  const { id } = req.params;
  const objectId = validateObjectId(id);

  const result = await carService.updateSingleCar(
    req.user.userId,
    req.user.role,
    objectId,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Car updated successfully',
    data: { result },
  });
});

const deleteSingleCar = catchAsync(async (req, res) => {
  const { id } = req.params;
  const objectId = validateObjectId(id);

  const result = await carService.deleteSingleCar(
    req.user.userId,
    req.user.role,
    objectId,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Car deleted successfully',
    data: { result },
  });
});
const returnTheCar = catchAsync(async (req, res) => {
  const result = await carService.returnTheCar(
    req.body,
    req.user.userId,
    req.user.role,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Car returned successfully...!',
    data: { result },
  });
});

export const carControllers = {
  createACar,
  getAllCars,
  getSingleCar,
  updateSingleCar,
  deleteSingleCar,
  returnTheCar,
};
