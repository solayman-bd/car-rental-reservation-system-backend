import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { IDecodedToken } from '../../interface/tokenInterface';
import { IBooking } from './booking.interface';
import UserModel from '../user/user.model';
import BookingModel from './booking.model';
import CarModel from '../car/car.model';
import mongoose, { ClientSession } from 'mongoose';

const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Car can only be booked by the user not admin.',
  USER_NOT_FOUND: 'User is not registered.',
  CAR_NOT_FOUND_OR_UNAVAILABLE:
    'Car is not registered, deleted, or not available.',
  BOOKING_DETAILS_NOT_FOUND: 'Booking details could not be fetched.',
  CAR_UPDATE_FAILED: 'Car not found or could not be updated.',
};

const bookACar = async (
  payload: IBooking,
  userId: mongoose.Types.ObjectId,
  role: 'admin' | 'user',
) => {
  let session: ClientSession | null = null;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    // Check user role
    if (role !== 'user') {
      throw new AppError(httpStatus.UNAUTHORIZED, ERROR_MESSAGES.UNAUTHORIZED);
    }

    // Check if user exists
    const user = await UserModel.findById(userId).session(session);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);
    }

    // Check if car exists and is available for booking
    const car = await CarModel.findById(payload.carId).session(session);
    if (!car || car.isDeleted || car.status !== 'available') {
      throw new AppError(
        httpStatus.NOT_FOUND,
        ERROR_MESSAGES.CAR_NOT_FOUND_OR_UNAVAILABLE,
      );
    }

    // Set user and car references
    payload.user = new mongoose.Types.ObjectId(userId);
    payload.car = payload.carId;

    // Create the booking document
    const booking = await BookingModel.create([payload], { session });
    // Update car availability status
    const updatedCar = await CarModel.findByIdAndUpdate(
      payload.carId,
      { $set: { status: 'unavailable' } },
      { new: true, session },
    ).session(session);

    if (!updatedCar) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        ERROR_MESSAGES.CAR_UPDATE_FAILED,
      );
    }
    // Populate user and car details in the booking document
    const populatedBooking = await BookingModel.findById(booking[0]._id)
      .populate('user', '_id name email role phone address')
      .populate(
        'car',
        '_id name description color isElectric features pricePerHour status isDeleted createdAt updatedAt',
      )
      .session(session)
      .exec();

    if (!populatedBooking) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        ERROR_MESSAGES.BOOKING_DETAILS_NOT_FOUND,
      );
    }
    await session.commitTransaction();
    return populatedBooking;
  } catch (err: any) {
    if (session) {
      await session.abortTransaction();
    }
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, err.message);
  } finally {
    if (session) {
      session.endSession();
    }
  }
};

const myBookings = async (
  userId: mongoose.Types.ObjectId,
  role: 'admin' | 'user',
) => {
  try {
    // Check user role
    if (role !== 'user') {
      throw new AppError(httpStatus.UNAUTHORIZED, ERROR_MESSAGES.UNAUTHORIZED);
    }

    // Check if user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);
    }

    // Create the booking document
    const myBookings = await BookingModel.find({ user: userId })
      .populate('user', '_id name email role phone address')
      .populate(
        'car',
        '_id name description color isElectric features pricePerHour status isDeleted createdAt updatedAt',
      );
    if (myBookings.length == 0) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'You do not have any booking...',
      );
    }
    return myBookings;
  } catch (err: any) {
    throw new Error(err);
  }
};

const getAllBookingOfASpeceficCarToASpeceficDate = async (
  userId: mongoose.Types.ObjectId,
  carId: mongoose.Types.ObjectId,
  date: string,
) => {
  try {
    // Check if user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found.');
    }

    // Query bookings
    const bookings = await BookingModel.find({ carId, date })
      .populate('user', '_id name email role phone address')
      .populate(
        'car',
        '_id name description color isElectric features pricePerHour status isDeleted createdAt updatedAt',
      );

    if (bookings.length == 0) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'No bookings found for the specified car and date.',
      );
    }

    return bookings; // Return the bookings array
  } catch (err) {
    throw err; // Propagate the caught error
  }
};
export const bookingService = {
  bookACar,
  myBookings,
  getAllBookingOfASpeceficCarToASpeceficDate,
};
