import { z } from 'zod';

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
    status: z.enum(['approved', 'pending']),
  }),
});
export const bookingValidations = { bookingSchema, bookingStatusChangeSchema };
