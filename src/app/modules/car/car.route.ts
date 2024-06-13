import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { carValidations } from './car.validation';
import { carControllers } from './car.controller';

const router = express.Router();

router.post(
  '/',
  validateRequest(carValidations.carValidationSchema),
  carControllers.createACar,
);

router.get('/', carControllers.getAllCars);
router.get('/:id', carControllers.getSingleCar);
router.put(
  '/:id',
  validateRequest(carValidations.carUpdateValidationSchema),
  carControllers.updateSingleCar,
);
router.delete('/:id', carControllers.deleteSingleCar);

export const carRoutes = router;
