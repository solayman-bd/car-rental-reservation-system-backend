import { z } from 'zod';

const bookingSchema = z.object({
  body: z.object({
    carId: z.string(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // Validate date format YYYY-MM-DD
    startTime: z.string().regex(/^\d{2}:\d{2}$/), // Validate time format HH:mm
  }),
});
export const bookingValidations = { bookingSchema };
