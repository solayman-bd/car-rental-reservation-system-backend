import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import ICar, { IReturn } from './car.interface';
import UserModel from '../user/user.model';
import CarModel from './car.model';
import mongoose from 'mongoose';
import { IDecodedToken } from '../../interface/tokenInterface';

import BookingModel from '../booking/booking.model';
import { validateObjectId } from '../../utils/validateObjectId';
const convertTimeToHours = (timeStr: string) => {
  // Split the time string into hours and minutes
  let timeParts = timeStr.split(':');
  let hours = parseInt(timeParts[0]);
  let minutes = parseInt(timeParts[1]);

  // Calculate the total hours since midnight
  let totalHours = hours + minutes / 60;

  return totalHours;
};

const createACar = async (payload: ICar, userId: mongoose.Types.ObjectId) => {
  try {
    const doesUserExist = await UserModel.findById(userId);
    if (!doesUserExist) {
      throw new AppError(httpStatus.NOT_FOUND, 'User is not registered..');
    }
    const result = await CarModel.create(payload);
    return result;
  } catch (err: any) {
    // Handle errors appropriately
    throw new Error(err);
  }
};
const getAllCars = async (
  userId: mongoose.Types.ObjectId,
  role: 'admin' | 'user',
) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User is not registered.');
    }

    let carsQuery = CarModel.find({});

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
  userId: mongoose.Types.ObjectId,
  role: 'admin' | 'user',
  carId: mongoose.Types.ObjectId,
) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User is not registered.');
    }

    let carQuery = CarModel.findById(carId);

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
  userId: mongoose.Types.ObjectId,
  role: 'admin' | 'user',
  carId: mongoose.Types.ObjectId,
  payload: Partial<ICar>,
) => {
  try {
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

    const car = await CarModel.findById(carId);
    if (!car || car?.isDeleted == true) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'Car is not found or the car is deleted..',
      );
    }

    // Update the car with the new payload
    const updatedCar = await CarModel.findByIdAndUpdate(
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
  userId: mongoose.Types.ObjectId,
  role: 'admin' | 'user',
  carId: mongoose.Types.ObjectId,
) => {
  try {
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

    const car = await CarModel.findById(carId);
    if (!car || car?.isDeleted == true) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'Car is not found or the car is deleted..',
      );
    }

    // Update the car with the new payload
    const sofDeletedCar = await CarModel.findByIdAndUpdate(
      carId,
      { $set: { isDeleted: true } },
      { new: true },
    );

    return sofDeletedCar;
  } catch (err: any) {
    throw new Error(err);
  }
};
const returnTheCar = async (
  payload: IReturn,
  userId: mongoose.Types.ObjectId,
  role: 'admin' | 'user',
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if user exists
    const user = await UserModel.findById(userId).session(session);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found.');
    }

    // Check user role
    if (role !== 'admin') {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'Only admin can return the car.',
      );
    }

    const { bookingId, endTime } = payload;
    const isValidBookingId = validateObjectId(bookingId);
    // Find the booking
    const booking =
      await BookingModel.findById(isValidBookingId).session(session);
    if (!booking) {
      throw new AppError(httpStatus.NOT_FOUND, 'Booking not found.');
    }

    // Update the booking with endTime
    const updatedBooking = await BookingModel.findByIdAndUpdate(
      isValidBookingId,
      { $set: { endTime: endTime } },
      { new: true, session },
    );
    if (!updatedBooking) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to update booking.',
      );
    }

    // Update car status to available
    const updatedCar = await CarModel.findByIdAndUpdate(
      updatedBooking.car,
      { $set: { status: 'available' } },
      { new: true, session },
    );
    if (!updatedCar) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to update car status.',
      );
    }

    // Calculate total cost and save
    const totalCost =
      (convertTimeToHours(endTime) -
        convertTimeToHours(updatedBooking.startTime)) *
      updatedCar.pricePerHour;
    updatedBooking.totalCost = totalCost;
    await updatedBooking.save({ session });

    // Populate and return updated booking
    const populatedBooking = await BookingModel.findById(isValidBookingId)
      .populate('user', '_id name email role phone address')
      .populate(
        'car',
        '_id name description color isElectric features pricePerHour status isDeleted createdAt updatedAt',
      )
      .session(session)
      .exec();

    if (!populatedBooking) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to populate booking.',
      );
    }

    await session.commitTransaction();
    return populatedBooking;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const carService = {
  createACar,
  getAllCars,
  getSingleCar,
  updateSingleCar,
  deleteSingleCar,
  returnTheCar,
};
