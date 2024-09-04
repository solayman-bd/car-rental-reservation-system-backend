import httpStatus from 'http-status';
import AppError from '../../errors/AppError';

import { IBooking } from './booking.interface';
import UserModel from '../user/user.model';
import BookingModel from './booking.model';
import CarModel from '../car/car.model';
import mongoose, { ClientSession } from 'mongoose';
import { handleServiceError } from '../../utils/handleServiceError';
import { BOOKING_STATUS, TBookingStatus } from './booking.constant';

const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Car can only be booked by the user not admin.',
  USER_NOT_FOUND: 'User is not registered.',
  CAR_NOT_FOUND_OR_UNAVAILABLE:
    'Car is not registered, deleted, or not available.',
  BOOKING_DETAILS_NOT_FOUND: 'Booking details could not be fetched.',
  CAR_UPDATE_FAILED: 'Car not found or could not be updated.',
  LOCATION_NOT_AVAILABLE: 'This car is not available to this location...',
  ADDITIONAL_FEATURES_NOT_AVAILABLE:
    'These additional features are not available to this car...',
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
    if (
      !car ||
      car.isDeleted ||
      car.status !== 'available' ||
      car.isCurrentlyHired
    ) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        ERROR_MESSAGES.CAR_NOT_FOUND_OR_UNAVAILABLE,
      );
    }
    // Check if startLocation matches any location in the car's array of locations
    const locationMatch = car.locationWhereAvailable.some(
      (location) => location === payload.startLocation,
    );
    if (!locationMatch) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        ERROR_MESSAGES.LOCATION_NOT_AVAILABLE,
      );
    }
    // Check if additionalFeatures in payload match with the car's additionalFeatures

    const additionalFeaturesMatch = payload.additionalFeatures.every(
      (feature) =>
        car.additionalFeatures.some(
          (carFeature) => carFeature.name === feature,
        ),
    );
    if (!additionalFeaturesMatch) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        ERROR_MESSAGES.ADDITIONAL_FEATURES_NOT_AVAILABLE,
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
      { $set: { status: 'unavailable', isCurrentlyHired: true } },
      { new: true, session },
    ).session(session);

    if (!updatedCar) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        ERROR_MESSAGES.CAR_UPDATE_FAILED,
      );
    }

    // Update user bookings array
    user.bookings.push(booking[0]._id);
    await user.save({ session });
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
    // Create the booking document
    const myBookings = await BookingModel.find({
      user: userId,
      status: { $in: ['pending', 'approved', 'returned'] }, // Corrected filter for multiple statuses
    })
      .populate('user', '_id name email role phone address')
      .populate(
        'car',
        '_id name description color isElectric features pricePerHour status isDeleted createdAt updatedAt locationWhereAvailable additionalFeatures',
      );

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
      '_id name description color isElectric features pricePerHour status isDeleted createdAt updatedAt locationWhereAvailable additionalFeatures',
    );

  return bookings; // Return the bookings array
};

const changeBookingStatus = async (
  bookingId: mongoose.Types.ObjectId,
  status: TBookingStatus,
) => {
  try {
    const booking = await BookingModel.findById(bookingId);
    if (!booking) {
      throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
    }

    // Update the booking status
    booking.status = status;

    // Save the updated booking
    const updatedBooking = await booking.save();
    // If the status is cancelled, update the user's bookings
    if (status === BOOKING_STATUS.cancelled) {
      // Find the user
      const user = await UserModel.findById(booking.user);
      if (user) {
        // Remove the booking from the user's bookings
        user.bookings = user.bookings.filter((item) => !item.equals(bookingId));
        // Save the updated user
        await user.save();
      }
    }

    return updatedBooking;
  } catch (err) {
    handleServiceError(err);
  }
};
const updateBooking = async (
  userId: mongoose.Types.ObjectId,
  bookingId: mongoose.Types.ObjectId,
  payload: Partial<IBooking>,
) => {
  try {
    // Find the user and check for existence
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Fetch the booking and check for existence
    const booking = await BookingModel.findById(bookingId);
    if (!booking) {
      throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
    }

    // Role-based status change checks
    if (
      (payload?.status === BOOKING_STATUS.approved ||
        payload?.status === BOOKING_STATUS.pending) &&
      user.role === 'user'
    ) {
      throw new AppError(
        httpStatus.CONFLICT,
        `Only admin can change the status to ${payload?.status}...`,
      );
    }

    // Prevent status changes for approved bookings by users
    if (booking.status === BOOKING_STATUS.approved && user.role === 'user') {
      throw new AppError(
        httpStatus.CONFLICT,
        'You cannot update the booking as it is already approved...',
      );
    }

    // Update the booking with the new payload
    const updatedBooking = (await BookingModel.findByIdAndUpdate(
      bookingId,
      { $set: payload },
      { new: true },
    )) as IBooking;

    // Handle cancellation status
    if (payload?.status === BOOKING_STATUS.cancelled) {
      // Find the user associated with the booking
      const bookingUser = await UserModel.findById(updatedBooking.user);
      if (bookingUser) {
        // Remove the booking from the user's bookings
        bookingUser.bookings = bookingUser.bookings.filter(
          (item) => item !== bookingId,
        );
        // Save the updated user
        await bookingUser.save();
      }
    }

    return updatedBooking;
  } catch (err) {
    handleServiceError(err);
  }
};
const getAllBookings = async (userId: mongoose.Types.ObjectId) => {
  try {
    // Check if user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);
    }
    const allBookings = await BookingModel.find({})
      .populate('user', '_id name email role phone address')
      .populate(
        'car',
        '_id name description color isElectric features pricePerHour status isDeleted createdAt updatedAt locationWhereAvailable additionalFeatures',
      );

    return allBookings;
  } catch (err: any) {
    throw new Error(err);
  }
};
export const bookingService = {
  bookACar,
  myBookings,
  getAllBookingOfASpeceficCarToASpeceficDate,
  changeBookingStatus,
  updateBooking,
  getAllBookings,
};
