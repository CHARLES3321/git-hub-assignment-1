/**
 * Response Interceptor Middleware
 * Standardizes all API responses with a consistent format
 */

/**
 * Response interceptor middleware that wraps all responses in a standardized format
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const responseInterceptor = (req, res, next) => {
    // Store the original json method
    const originalJson = res.json;

    // Override the json method to wrap responses
    res.json = function(data) {
        // Determine if this is an error response based on status code
        const isError = res.statusCode >= 400;
        
        // Create standardized response format
        const standardizedResponse = {
            success: !isError,
            status: res.statusCode,
            message: data?.message || (isError ? 'An error occurred' : 'Request successful'),
            data: isError ? null : data,
            error: isError ? data : null,
            timestamp: new Date().toISOString(),
            path: req.originalUrl,
            method: req.method
        };

        // Call the original json method with the standardized response
        return originalJson.call(this, standardizedResponse);
    };

    // Store the original status method to track status codes
    const originalStatus = res.status;
    res.status = function(code) {
        this.statusCode = code;
        return originalStatus.call(this, code);
    };

    next();
};

/**
 * Success response helper
 * @param {Object} res - Express response object
 * @param {*} data - Data to send
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default: 200)
 */
export const sendSuccess = (res, data = null, message = 'Request successful', statusCode = 200) => {
    return res.status(statusCode).json({
        data,
        message
    });
};

/**
 * Error response helper
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {*} error - Additional error details
 */
export const sendError = (res, message = 'Internal server error', statusCode = 500, error = null) => {
    return res.status(statusCode).json({
        message,
        error
    });
};

/**
 * Validation error response helper
 * @param {Object} res - Express response object
 * @param {Array|Object} errors - Validation errors
 * @param {string} message - Error message (default: 'Validation failed')
 */
export const sendValidationError = (res, errors, message = 'Validation failed') => {
    return res.status(400).json({
        message,
        error: {
            type: 'validation',
            details: errors
        }
    });
};

/**
 * Not found response helper
 * @param {Object} res - Express response object
 * @param {string} message - Error message (default: 'Resource not found')
 */
export const sendNotFound = (res, message = 'Resource not found') => {
    return res.status(404).json({
        message
    });
};

/**
 * Unauthorized response helper
 * @param {Object} res - Express response object
 * @param {string} message - Error message (default: 'Unauthorized')
 */
export const sendUnauthorized = (res, message = 'Unauthorized') => {
    return res.status(401).json({
        message
    });
};

/**
 * Forbidden response helper
 * @param {Object} res - Express response object
 * @param {string} message - Error message (default: 'Forbidden')
 */
export const sendForbidden = (res, message = 'Forbidden') => {
    return res.status(403).json({
        message
    });
};
