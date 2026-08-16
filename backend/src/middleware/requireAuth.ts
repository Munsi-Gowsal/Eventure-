import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import jwt from 'jsonwebtoken';

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication credentials missing or malformed',
      },
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyAccessToken(token);
    req.admin = {
      id: payload.id,
      email: payload.email,
    };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Your session has expired. Please refresh your session.',
        },
      });
      return;
    }
    
    res.status(401).json({
      success: false,
      error: {
        code: 'TOKEN_INVALID',
        message: 'The access token is invalid.',
      },
    });
  }
};
