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
router.put(
  '/update-user',
  authGuard(),
  validateRequest(userValidations.userUpdateValidationSchema),
  userControllers.updateUser,
);
router.delete(
  '/delete-a-user',
  authGuard('admin'),
  validateRequest(userValidations.userDeleteValidationSchema),
  userControllers.deleteAUser,
);
router.get('/all-users', authGuard('admin'), userControllers.getAllUsers);

router.put(
  '/update-user-by-admin/:userId',
  authGuard('admin'),
  validateRequest(userValidations.userUpdateValidationSchema),
  userControllers.updateUserByAdmin,
);

export const userRoutes = router;
