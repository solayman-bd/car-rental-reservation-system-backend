import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { bookingValidations } from './booking.validation';
import { bookingControllers } from './booking.controller';
import authGuard from '../../utils/authGuard';

const router = express.Router();

router.post(
  '/',
  validateRequest(bookingValidations.bookingSchema),
  authGuard('user'),
  bookingControllers.bookACar,
);
router.get(
  '/',
  authGuard('admin'),
  bookingControllers.getAllBookingOfASpeceficCarToASpeceficDate,
);
router.get('/my-bookings', authGuard('user'), bookingControllers.myBookings);

export const bookingRoutes = router;
