import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import IUser from './user.interface';
import UserModel from './user.model';
import { createToken } from './user.utils';
import config from '../../config';
import { verifyToken } from '../../utils/verifyToken';
import { IDecodedToken } from '../../interface/tokenInterface';

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
    // Handle errors appropriately
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

const refreshToken = async (token: string) => {
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Please sign in...');
  }
  // checking if the given token is valid
  const decoded = verifyToken(
    token,
    config.jwt_refresh_secret as string,
  ) as IDecodedToken;
  if (!decoded) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Token verification failed...');
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
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

export const userService = {
  signInUser,
  signUpUser,
  refreshToken,
};
