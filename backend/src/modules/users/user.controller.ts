import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';

export const getMyRegistrations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'User not authenticated' } });
      return;
    }
    const registrations = await UserService.getMyRegistrations(req.user.id);
    res.status(200).json({
      success: true,
      data: registrations,
    });
  } catch (error) {
    next(error);
  }
};
