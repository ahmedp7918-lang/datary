const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too many requests from this IP, please try again later.'
    }
});

// Stricter limiter for generation endpoints
const generationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 50, // 50 generations per hour
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Generation limit reached. Please wait before generating more data.'
    }
});

module.exports = {
    default: limiter,
    generation: generationLimiter
};