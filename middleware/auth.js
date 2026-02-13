export const authenticate = (req, res, next) => {
    if (req.path === '/login' && req.method === 'POST') {
        return next();
    }

    const adminKeyEnv = process.env.DYNAMIC_EP_ADMIN_KEY;
    const apiKey = req.cookies['adminKey'];

    if (!apiKey || apiKey !== adminKeyEnv) {
        return res.status(401).json({ error: "Unauthorized: Invalid or missing API Key" });
    }
    next();
};
