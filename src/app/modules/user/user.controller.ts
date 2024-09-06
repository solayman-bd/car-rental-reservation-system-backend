import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { userService } from './user.service';
import config from '../../config';
import { validateObjectId } from '../../utils/validateObjectId';

const signInUser = catchAsync(async (req, res) => {
  const result = await userService.signInUser(req.body);
  const { user, accessToken, refreshToken } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });
  return sendResponse(res, {
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
  const result = await userService.updateUser(
    req.user.userId,
    req.user.role,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const result = await userService.getAllUser();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All users retrived successfully...',
    data: result,
  });
});
const deleteAUser = catchAsync(async (req, res) => {
  const result = await userService.delteAUser(req.body.userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});
const updateUserByAdmin = catchAsync(async (req, res) => {
  const userId = validateObjectId(req.params.userId);

  const result = await userService.updateUserByAdmin(userId, req.body);

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
  getAllUsers,
  deleteAUser,
  updateUserByAdmin,
};
