import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { bookingService } from './booking.service';
import { validateObjectId } from '../../utils/validateObjectId';
import AppError from '../../errors/AppError';
function isValidDateFormat(dateStr: string) {
  // Regular expression to match YYYY-MM-DD format
  const regex = /^\d{4}-\d{2}-\d{2}$/;

  // Test the input date string against the regex
  const result = regex.test(dateStr);
  if (result) {
    return dateStr;
  } else return false;
}

const bookACar = catchAsync(async (req, res) => {
  const result = await bookingService.bookACar(
    req.body,
    req.user.userId,
    req.user.role,
  );
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Car booked successfully!',
    data: { result },
  });
});

const myBookings = catchAsync(async (req, res) => {
  const result = await bookingService.myBookings(
    req.user.userId,
    req.user.role,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My Bookings retrieved successfully!',
    data: { result },
  });
});
const getAllBookingOfASpeceficCarToASpeceficDate = catchAsync(
  async (req, res) => {
    const carId = validateObjectId(req.query.carId as string);
    const date = isValidDateFormat(req.query.date as string);
    if (!date) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Use valid date format (format: YYYY-MM-DD)',
      );
    }
    const result =
      await bookingService.getAllBookingOfASpeceficCarToASpeceficDate(
        req.user.userId,
        carId,
        date,
      );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Bookings retrieved successfully!',
      data: result,
    });
  },
);
export const bookingControllers = {
  bookACar,
  myBookings,
  getAllBookingOfASpeceficCarToASpeceficDate,
};
