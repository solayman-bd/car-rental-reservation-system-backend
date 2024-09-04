import { z } from 'zod';

// Define the User validation schema
const userSignUpValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(3, { message: 'Name must be at least 3 characters long' }),
    email: z.string().email({ message: 'Invalid email format' }),
    role: z.enum(['user', 'admin']).optional(),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' }),
    phone: z
      .string()
      .min(10, { message: 'Phone number must be at least 10 digits long' })
      .optional(),
    address: z
      .string()
      .min(5, { message: 'Address must be at least 5 characters long' })
      .optional(),
    preferences: z.array(z.string()).optional(),
    status: z.enum(['active', 'blocked']).optional(),
  }),
});
const userUpdateValidationSchema = z.object({
  body: z.object({
    name: userSignUpValidationSchema.shape.body.shape.name.optional(),
    email: userSignUpValidationSchema.shape.body.shape.email.optional(),
    role: userSignUpValidationSchema.shape.body.shape.role.optional(),
    password: userSignUpValidationSchema.shape.body.shape.password.optional(),
    phone: userSignUpValidationSchema.shape.body.shape.phone.optional(),
    address: userSignUpValidationSchema.shape.body.shape.address.optional(),
    preferences:
      userSignUpValidationSchema.shape.body.shape.preferences.optional(),
  }),
});
const userSignInValidationSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required.' })
      .email({ message: 'Invalid Email' }),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required!',
    }),
  }),
});
const userDeleteValidationSchema = z.object({
  body: z.object({
    userId: z.string(),
  }),
});
export const userValidations = {
  userSignUpValidationSchema,
  userSignInValidationSchema,
  refreshTokenValidationSchema,
  userUpdateValidationSchema,
  userDeleteValidationSchema,
};
