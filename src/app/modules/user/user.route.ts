import express from 'express';
import { userControllers } from './user.controller';

import validateRequest from '../../middlewares/validateRequest';
import { userValidations } from './user.validation';
const router = express.Router();

router.post(
  '/signup',
  validateRequest(userValidations.userSignUpValidationSchema),
  userControllers.signUpUser,
);
router.post(
  '/signin',
  validateRequest(userValidations.userSignInValidationSchema),
  userControllers.signInUser,
);

router.post('/signout', userControllers.signout);

router.post(
  '/refresh-token',
  validateRequest(userValidations.refreshTokenValidationSchema),
  userControllers.refreshToken,
);

export const userRoutes = router;
