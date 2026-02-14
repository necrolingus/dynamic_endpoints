import rateLimit from 'express-rate-limit';

const limit = process.env.DYNAMIC_EP_LOGIN_RATE_LIMIT ? parseInt(process.env.DYNAMIC_EP_LOGIN_RATE_LIMIT) : 5;
const windowMs = process.env.DYNAMIC_EP_LOGIN_RATE_LIMIT_WINDOW ? parseInt(process.env.DYNAMIC_EP_LOGIN_RATE_LIMIT_WINDOW) : 10000;

export const loginLimiter = rateLimit({
    windowMs: windowMs,
    max: limit, // Limit each IP to X login requests per `window`
    message: { error: 'Too many login attempts, please try again later' },
    standardHeaders: true,
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
