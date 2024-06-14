import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { carValidations } from './car.validation';
import { carControllers } from './car.controller';
import authGuard from '../../utils/authGuard';

const router = express.Router();

router.post(
  '/',
  validateRequest(carValidations.carValidationSchema),
  authGuard('admin'),
  carControllers.createACar,
);

router.get('/', authGuard(), carControllers.getAllCars);
router.get('/:id', authGuard(), carControllers.getSingleCar);

router.put(
  '/return',
  validateRequest(carValidations.carReturnValidationSchema),
  authGuard('admin'),
  carControllers.returnTheCar,
);

router.delete('/:id', authGuard('admin'), carControllers.deleteSingleCar);

router.put(
  '/:id',
  validateRequest(carValidations.carUpdateValidationSchema),
  authGuard('admin'),
  carControllers.updateSingleCar,
);
export const carRoutes = router;
