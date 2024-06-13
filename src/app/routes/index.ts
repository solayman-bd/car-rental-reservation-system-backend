import { Router } from 'express';
import { userRoutes } from '../modules/user/user.route';
import { carRoutes } from '../modules/car/car.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: userRoutes,
  },
  {
    path: '/cars',
    route: carRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
