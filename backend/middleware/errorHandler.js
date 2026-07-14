module.exports = (err, req, res, next) => {
    console.error('Error:', err);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Different responses for development vs production
    const response = {
        success: false,
        error: message
    };

    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
        response.details = err.details || null;
    }

    res.status(statusCode).json(response);
};

// Custom error classes
class ValidationError extends Error {
    constructor(message, details = null) {
        super(message);
        this.name = 'ValidationError';
        this.statusCode = 400;
        this.details = details;
    }
}

class GenerationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'GenerationError';
        this.statusCode = 500;
    }
}

module.exports.ValidationError = ValidationError;
module.exports.GenerationError = GenerationError;