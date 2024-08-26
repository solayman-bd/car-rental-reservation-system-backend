import { z } from 'zod';
import { BOOKING_STATUS } from './booking.constant';

const bookingSchema = z.object({
  body: z.object({
    carId: z.string(),
    hiringDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // Validate date format YYYY-MM-DD
    startTime: z.string().regex(/^\d{2}:\d{2}$/), // Validate time format HH:mm
    additionalFeatures: z.array(z.string()).optional(),
    startLocation: z.string(),
  }),
});
const bookingStatusChangeSchema = z.object({
  body: z.object({
    bookingId: z.string(),
    status: z.enum([
      BOOKING_STATUS.pending,
      BOOKING_STATUS.approved,
      BOOKING_STATUS.cancelled,
    ]),
  }),
});

const updateBookingSchema = z.object({
  body: z.object({
    hiringDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(), // Validate date format YYYY-MM-DD
    startTime: z
      .string()
      .regex(/^\d{2}:\d{2}$/)
      .optional(), // Validate time format HH:mm
    additionalFeatures: z.array(z.string()).optional(),
    startLocation: z.string().optional(),
    status: z
      .enum([
        BOOKING_STATUS.pending,
        BOOKING_STATUS.approved,
        BOOKING_STATUS.cancelled,
      ])
      .optional(),
  }),
});
export const bookingValidations = {
  bookingSchema,
  bookingStatusChangeSchema,
  updateBookingSchema,
};
