import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';

const app: Application = express();

// Middleware for parsing JSON and cookies
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true); // Accepts requests from all origins
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Allows credentials (cookies, authorization headers)
    allowedHeaders: ['Content-Type', 'Authorization'], // Customize headers as needed
  }),
);

// Root testing route
app.get('/', (req, res) => {
  res.send('Root Testing Route: Server is running!');
});

// Application routes
app.use('/api', router);

// Handle 404 - Not Found
app.use(notFound);
// Global error handler
app.use(globalErrorHandler);

export default app;
