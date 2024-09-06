import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import IUser from './user.interface';
import UserModel from './user.model';
import { createToken } from './user.utils';
import config from '../../config';
import { verifyToken } from '../../utils/verifyToken';
import { IDecodedToken } from '../../interface/tokenInterface';
import mongoose from 'mongoose';
import { handleServiceError } from '../../utils/handleServiceError';
import BookingModel from '../booking/booking.model';

const signUpUser = async (payload: IUser) => {
  try {
    // Check if user with the same email already exists
    const existingUser = await UserModel.findOne({ email: payload.email });
    if (existingUser) {
      throw new AppError(httpStatus.CONFLICT, 'User already exists');
    }

    // Create the user if email does not exist
    const user = await UserModel.create(payload);

    // Return user object without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  } catch (err) {
    handleServiceError(err);
  }
};

const signInUser = async (
  payload: Partial<IUser>,
): Promise<{ user: IUser; accessToken: string; refreshToken: string }> => {
  try {
    // Ensure email and password are provided
    if (!payload.email || !payload.password) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Email and password are required',
      );
    }

    // Find user by email
    const user = await UserModel.findOne({ email: payload.email });

    // Check if user exists
    if (!user) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid email or password');
    }

    // Check if password is correct
    const isPasswordValid = await user.comparePassword(payload.password);
    if (!isPasswordValid) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
    }
    //create token and sent to the  client

    const jwtPayload = {
      userId: user.id,
      role: user.role,
      name: user.name,
    };

    // Remove sensitive fields from user object
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userData } = user.toObject();
    const accessToken: string = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string,
    );
    const refreshToken: string = createToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.jwt_refresh_expires_in as string,
    );

    return {
      user: userData as IUser,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  } catch (err) {
    handleServiceError(err);
    return undefined as never;
  }
};

const refreshToken = async (token: string) => {
  try {
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Please sign in...');
    }
    // checking if the given token is valid
    const decoded = verifyToken(
      token,
      config.jwt_refresh_secret as string,
    ) as IDecodedToken;
    if (!decoded) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'Token verification failed...',
      );
    }
    const { userId } = decoded;

    // checking if the user is exist
    const existingUser = await UserModel.findById(userId);

    if (!existingUser) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }

    const jwtPayload = {
      userId: existingUser._id as string,
      role: existingUser.role,
      name: existingUser.name,
    };

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string,
    );

    return {
      accessToken,
    };
  } catch (err) {
    handleServiceError(err);
  }
};
const updateUser = async (
  userId: mongoose.Types.ObjectId,
  role: 'user' | 'admin',
  payload: Partial<IUser>,
) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Update the car with the new payload

    if (role == 'user' && payload.role == 'admin') {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'A user can not change his role to admin..',
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...updatedUser } = (
      await UserModel.findByIdAndUpdate(
        userId,
        { $set: payload },
        { new: true },
      )
    )?.toObject() as IUser;

    return updatedUser;
  } catch (err) {
    handleServiceError(err);
  }
};

const getAllUser = async () => {
  try {
    const allUsers = await UserModel.find({}).select('-password');
    return allUsers;
  } catch (err) {
    return handleServiceError(err);
  }
};

const delteAUser = async (userIdToDelete: mongoose.Types.ObjectId) => {
  try {
    const user = await UserModel.findById(userIdToDelete);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'The user not found.');
    }

    const userBookings = await BookingModel.find({ user: userIdToDelete });

    if (userBookings.length === 0) {
      await UserModel.deleteOne({ _id: userIdToDelete });
    } else {
      for (const booking of userBookings) {
        if (booking.status === 'pending') {
          // Delete the user and the booking
          await BookingModel.deleteOne({ _id: booking._id });
          const deletedUser = await UserModel.deleteOne({
            _id: userIdToDelete,
          });
          return deletedUser;
        } else if (booking.status === 'approved') {
          throw new AppError(
            httpStatus.FORBIDDEN,
            'User cannot be deleted because of an approved booking.',
          );
        } else if (booking.status === 'returned') {
          if (booking.isPaid) {
            // Delete the user and the booking
            await BookingModel.deleteOne({ _id: booking._id });
            const deletedUser = await UserModel.deleteOne({
              _id: userIdToDelete,
            });
            return deletedUser;
          } else {
            throw new AppError(
              httpStatus.FORBIDDEN,
              'User cannot be deleted because the booking is returned but not paid.',
            );
          }
        }
      }
    }
  } catch (err) {
    handleServiceError(err);
    return undefined as never;
  }
};
const updateUserByAdmin = async (
  userId: mongoose.Types.ObjectId,
  payload: Partial<IUser>,
) => {
  try {
    // Check if the email field is included in the payload
    if (payload.email) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Admin cannot change the email of the user.',
      );
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...updatedUser } = (
      await UserModel.findByIdAndUpdate(
        userId,
        { $set: payload },
        { new: true },
      )
    )?.toObject() as IUser;

    return updatedUser;
  } catch (err) {
    handleServiceError(err);
  }
};

export const userService = {
  signInUser,
  signUpUser,
  refreshToken,
  updateUser,
  getAllUser,
  delteAUser,
  updateUserByAdmin,
};
