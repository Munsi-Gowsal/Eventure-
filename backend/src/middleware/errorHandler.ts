import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError } from '../utils/AppError';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  if (res.headersSent) {
    return next(err);
  }

  // Zod Validation Error
  if (err instanceof z.ZodError) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        fields: err.flatten().fieldErrors,
      },
    });
    return;
  }

  // Custom App Error or generic mapping
  const statusCode = err instanceof AppError ? err.statusCode : (err.statusCode || 500);
  let code = err instanceof AppError ? err.code : (err.code || 'INTERNAL_ERROR');
  let message = err.message || 'An unexpected error occurred';

  // Do not leak internal server error details in production
  if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    code = 'INTERNAL_ERROR';
    message = 'An unexpected error occurred';
  } else if (statusCode === 500) {
      console.error('Internal Server Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
    },
  });
};
