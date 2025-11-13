import express from 'express';
import { createServer } from 'http';
import expressListRoutes from 'express-list-routes';

// Import middleware
import { responseInterceptor } from './common/middlename/response.interceptor.js';
import { errorHandler, notFoundHandler } from './common/middlename/error-handler.middleware.js';
import { requestLogger, devLogger, errorLogger } from './common/middlename/logger.middleware.js';

// import router
import { appRouter } from "./modules/routes.js";

// create base application configuration
const app = express();
const server = createServer(app);

// Request logging middleware (should be first)
app.use(requestLogger);

// Development logging middleware
app.use(devLogger);

// JSON parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Response interceptor middleware (should be before routes)
app.use(responseInterceptor);

// Application routing configuration
// Add your routes here
app.use('/api/v1', appRouter);
// Middleware to list available routes
expressListRoutes(appRouter);

// 404 handler (should be before error handler)
app.use(notFoundHandler);

// Error logging middleware
app.use(errorLogger);

// Global error handler (should be last)
app.use(errorHandler);

export { app, server };