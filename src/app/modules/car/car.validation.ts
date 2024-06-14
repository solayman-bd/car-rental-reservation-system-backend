import { z } from 'zod';

// Define the Car validation schema
const carValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(3, { message: 'Name must be at least 3 characters long' }),
    description: z
      .string()
      .min(10, { message: 'Description must be at least 10 characters long' }),
    color: z.string(),
    isElectric: z.boolean(),
    features: z.array(z.string()),
    pricePerHour: z
      .number()
      .min(0, { message: 'Price per hour must be non-negative' }),
  }),
});
// Create a partial schema for updates
const carUpdateValidationSchema = z.object({
  body: z.object({
    name: carValidationSchema.shape.body.shape.name.optional(),
    description: carValidationSchema.shape.body.shape.description.optional(),
    color: carValidationSchema.shape.body.shape.color.optional(),
    isElectric: carValidationSchema.shape.body.shape.isElectric.optional(),
    features: carValidationSchema.shape.body.shape.features.optional(),
    pricePerHour: carValidationSchema.shape.body.shape.pricePerHour.optional(),
  }),
});
const carReturnValidationSchema = z.object({
  body: z.object({
    bookingId: z.string(),
    endTime: z.string().regex(/^\d{2}:\d{2}$/), // Validate time format HH:mm
  }),
});
// Export the validation schemas
export const carValidations = {
  carValidationSchema,
  carUpdateValidationSchema,
  carReturnValidationSchema,
};
