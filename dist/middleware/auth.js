"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireApiKey = void 0;
function requireApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    const expectedKey = process.env.API_KEY;
    if (!expectedKey || !apiKey || apiKey !== expectedKey) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    next();
}
exports.requireApiKey = requireApiKey;
