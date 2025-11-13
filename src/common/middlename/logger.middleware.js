/**
 * Logger Middleware
 * Request and response logging for the application
 */

/**
 * Request logger middleware
 * Logs incoming requests with details
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const requestLogger = (req, res, next) => {
    const startTime = Date.now();
    
    // Store start time for response logging
    req.startTime = startTime;
    
    // Log incoming request
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - Incoming request`, {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        contentType: req.get('Content-Type'),
        contentLength: req.get('Content-Length')
    });

    // Override res.end to log response
    const originalEnd = res.end;
    res.end = function(chunk, encoding) {
        const duration = Date.now() - startTime;
        
        // Log response
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - Response sent`, {
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            contentLength: res.get('Content-Length') || 0
        });

        // Call original end method
        originalEnd.call(this, chunk, encoding);
    };

    next();
};

/**
 * Development logger middleware
 * More detailed logging for development environment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const devLogger = (req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
        console.log('=== REQUEST DETAILS ===');
        console.log('Method:', req.method);
        console.log('URL:', req.originalUrl);
        console.log('Headers:', req.headers);
        console.log('Body:', req.body);
        console.log('Query:', req.query);
        console.log('Params:', req.params);
        console.log('======================');
    }
    next();
};

/**
 * Error logger middleware
 * Logs errors with additional context
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const errorLogger = (err, req, res, next) => {
    console.error('=== ERROR LOGGED ===');
    console.error('Timestamp:', new Date().toISOString());
    console.error('Error Message:', err.message);
    console.error('Error Stack:', err.stack);
    console.error('Request URL:', req.originalUrl);
    console.error('Request Method:', req.method);
    console.error('Request Headers:', req.headers);
    console.error('Request Body:', req.body);
    console.error('====================');
    
    next(err);
};

/**
 * Simple console logger
 * Basic logging utility
 */
export const logger = {
    info: (message, data = {}) => {
        console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data);
    },
    
    error: (message, error = {}) => {
        console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
    },
    
    warn: (message, data = {}) => {
        console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, data);
    },
    
    debug: (message, data = {}) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`, data);
        }
    }
};
