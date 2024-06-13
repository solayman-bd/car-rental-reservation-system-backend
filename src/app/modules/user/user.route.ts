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

export const userRoutes = router;
