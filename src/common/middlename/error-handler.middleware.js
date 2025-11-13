/**
 * Error Handler Middleware
 * Centralized error handling for the application
 */

import {ValidationError} from "../error-definition.js";

/**
 * Global error handler middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const errorHandler = (err, req, res, next) => {
    // Log the error for debugging
    console.error('Error occurred:', {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    // Default error response
    let statusCode = 500;
    let message = 'Internal server error';
    let error = null;

    // Handle different types of errors
    if (err.name === 'ValidationError' && err instanceof ValidationError) {
        statusCode = 400;
        message = err.message || 'Validation failed';
        error = {
            type: 'validation',
            details: err.details
        };
    } else if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid ID format';
        error = {
            type: 'cast',
            details: 'The provided ID is not in the correct format'
        };
    } else if (err.name === 'MongoError' || err.name === 'MongoServerError') {
        statusCode = 500;
        message = 'Database error';
        error = {
            type: 'database',
            details: process.env.NODE_ENV === 'production' 
                ? 'A database error occurred' 
                : err.message
        };
    } else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
        error = {
            type: 'authentication',
            details: 'The provided token is invalid'
        };
    } else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
        error = {
            type: 'authentication',
            details: 'The provided token has expired'
        };
    } else if (err.statusCode) {
        // Custom error with status code
        statusCode = err.statusCode;
        message = err.message;
        error = err.error || null;
    }

    // Send error response
    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message,
        error,
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
        method: req.method
    });
};

/**
 * Async error wrapper to catch errors in async route handlers
 * @param {Function} fn - Async function to wrap
 * @returns {Function} - Wrapped function that catches errors
 */
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

/**
 * Custom error class for application-specific errors
 */
export class AppError extends Error {
    constructor(message, statusCode = 500, error = null) {
        super(message);
        this.statusCode = statusCode;
        this.error = error;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * 404 Not Found handler
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const notFoundHandler = (req, res, next) => {
    const error = new AppError(
        `The request route ${req.originalUrl} does not exist for the ${req.method.toLowerCase()} method`,
        404
    );
    next(error);
};
