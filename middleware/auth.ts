import { Request, Response, NextFunction } from 'express';

export function requireApiKey(req: Request, res: Response, next: NextFunction): void {
  const apiKey = req.headers['x-api-key'];
  const expectedKey = process.env.API_KEY;

  if (!expectedKey || !apiKey || apiKey !== expectedKey) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  next();
}
