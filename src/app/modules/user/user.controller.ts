import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { userService } from './user.service';
import config from '../../config';

const signInUser = catchAsync(async (req, res) => {
  const result = await userService.signInUser(req.body);
  const { user, accessToken, refreshToken } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is logged in succesfully!',
    data: user,
    accessToken,
  });
});
const signUpUser = catchAsync(async (req, res) => {
  const result = await userService.signUpUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User registered successfully!',
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await userService.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token is retrieved succesfully!',
    data: result,
  });
});

const signout = catchAsync(async (req, res) => {
  res.clearCookie('refreshToken', {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'none',
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Logged out successfully',
    data: null,
  });
});
const updateUser = catchAsync(async (req, res) => {
  const result = await userService.updateUser(req.user.userId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});
export const userControllers = {
  signInUser,
  signUpUser,
  refreshToken,
  signout,
  updateUser,
};
