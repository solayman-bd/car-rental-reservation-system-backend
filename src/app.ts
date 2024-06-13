import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';

const app: Application = express();

// Middleware for parsing JSON and cookies
app.use(express.json());
app.use(cookieParser());

// Enable CORS for any origin
app.use(cors());

// Application routes
app.use('/api/v1', router);

// Global error handler
app.use(globalErrorHandler);

// Handle 404 - Not Found
app.use(notFound);

export default app;
