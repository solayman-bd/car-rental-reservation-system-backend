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
    basicFeatures: z.array(z.string()),
    additionalFeatures: z
      .array(z.object({ name: z.string(), feePerHour: z.number() }))
      .optional(),
    pricePerHour: z
      .number()
      .min(0, { message: 'Price per hour must be non-negative' }),
    isCurrentlyHired: z.boolean().optional(),
    locationWhereAvailable: z.array(z.string()),
    img: z.array(z.string()).optional(),
  }),
});
// Create a partial schema for updates
// Create a partial schema for updates using the base schema
const carUpdateValidationSchema = z.object({
  body: z.object({
    name: carValidationSchema.shape.body.shape.name.optional(),
    description: carValidationSchema.shape.body.shape.description.optional(),
    color: carValidationSchema.shape.body.shape.color.optional(),
    isElectric: carValidationSchema.shape.body.shape.isElectric.optional(),
    basicFeatures:
      carValidationSchema.shape.body.shape.basicFeatures.optional(),
    additionalFeatures:
      carValidationSchema.shape.body.shape.additionalFeatures.optional(),
    pricePerHour: carValidationSchema.shape.body.shape.pricePerHour.optional(),
    isCurrentlyHired:
      carValidationSchema.shape.body.shape.isCurrentlyHired.optional(),
    locationWhereAvailable:
      carValidationSchema.shape.body.shape.locationWhereAvailable.optional(),
  }),
});

const carReturnValidationSchema = z.object({
  body: z.object({
    bookingId: z.string(),
    endTime: z.string().regex(/^\d{2}:\d{2}$/), // Validate time format HH:mm
    returningDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // Validate date format YYYY-MM-DD
  }),
});
// Export the validation schemas
export const carValidations = {
  carValidationSchema,
  carUpdateValidationSchema,
  carReturnValidationSchema,
};
