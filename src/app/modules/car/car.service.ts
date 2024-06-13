import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import ICar, { IDecodedToken } from './car.interface';
import UserModel from '../user/user.model';
import carModel from './car.model';
import mongoose from 'mongoose';

const createACar = async (payload: ICar, decodedToken: IDecodedToken) => {
  try {
    const { role, userId } = decodedToken;
    if (role != 'admin') {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'Car can only be created by Admin',
      );
    }
    const doesUserExist = await UserModel.findById(userId);
    if (!doesUserExist) {
      throw new AppError(httpStatus.NOT_FOUND, 'User is not registered..');
    }
    const result = await carModel.create(payload);
    return result;
  } catch (err: any) {
    // Handle errors appropriately
    throw new Error(err);
  }
};
const getAllCars = async (decodedToken: IDecodedToken) => {
  try {
    const { userId, role } = decodedToken;

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User is not registered.');
    }

    let carsQuery = carModel.find({});

    if (role !== 'admin') {
      carsQuery = carsQuery.where('isDeleted').equals(false);
    }

    const result = await carsQuery.exec();
    return result;
  } catch (err: any) {
    throw new Error(err);
  }
};

const getSingleCar = async (
  decodedToken: IDecodedToken,
  carId: mongoose.Types.ObjectId,
) => {
  try {
    const { userId, role } = decodedToken;

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User is not registered.');
    }

    let carQuery = carModel.findById(carId);

    if (role !== 'admin') {
      carQuery = carQuery.where('isDeleted').equals(false);
    }

    const car = await carQuery.exec();
    if (!car) {
      throw new AppError(httpStatus.NOT_FOUND, 'Car not found.');
    }

    return car;
  } catch (err: any) {
    throw new Error(err);
  }
};
const updateSingleCar = async (
  decodedToken: IDecodedToken,
  carId: mongoose.Types.ObjectId,
  payload: Partial<ICar>,
) => {
  try {
    const { role, userId } = decodedToken;

    if (role !== 'admin') {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'Only Admins can update cars',
      );
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    const car = await carModel.findById(carId);
    if (!car || car?.isDeleted == true) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'Car is not found or the car is deleted..',
      );
    }

    // Update the car with the new payload
    const updatedCar = await carModel.findByIdAndUpdate(
      carId,
      { $set: payload },
      { new: true },
    );

    return updatedCar;
  } catch (err: any) {
    throw new Error(err);
  }
};

const deleteSingleCar = async (
  decodedToken: IDecodedToken,
  carId: mongoose.Types.ObjectId,
) => {
  try {
    const { role, userId } = decodedToken;

    if (role !== 'admin') {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'Only Admins can update cars',
      );
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    const car = await carModel.findById(carId);
    if (!car || car?.isDeleted == true) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'Car is not found or the car is deleted..',
      );
    }

    // Update the car with the new payload
    const sofDeletedCar = await carModel.findByIdAndUpdate(
      carId,
      { $set: { isDeleted: true } },
      { new: true },
    );

    return sofDeletedCar;
  } catch (err: any) {
    throw new Error(err);
  }
};

export const CarService = {
  createACar,
  getAllCars,
  getSingleCar,
  updateSingleCar,
  deleteSingleCar,
};
