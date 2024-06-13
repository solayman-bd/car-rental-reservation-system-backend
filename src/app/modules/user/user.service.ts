import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import IUser from './user.interface';
import UserModel from './user.model';
import { createToken } from './user.utils';
import config from '../../config';

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
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  } catch (err: any) {
    // Handle errors appropriately
    throw new Error(err);
  }
};

const signInUser = async (
  payload: Partial<IUser>,
): Promise<{ user: IUser; token: string }> => {
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
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
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
    };

    // Remove sensitive fields from user object
    const { password, ...userData } = user.toObject();
    const accessToken: string = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string,
    );
    return { user: userData as IUser, token: accessToken };
  } catch (err) {
    // Ensure we throw an AppError if it's already one, or wrap other errors
    if (err instanceof AppError) {
      throw err;
    } else {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Internal Server Error',
      );
    }
  }
};
export const userService = {
  signInUser,
  signUpUser,
};
