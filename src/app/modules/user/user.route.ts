import express from 'express';
import { userControllers } from './user.controller';

import validateRequest from '../../middlewares/validateRequest';
import { userValidations } from './user.validation';
import authGuard from '../../utils/authGuard';
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
router.post(
  '/update-user',
  authGuard(),
  validateRequest(userValidations.userUpdateValidationSchema),
  userControllers.updateUser,
);
export const userRoutes = router;
