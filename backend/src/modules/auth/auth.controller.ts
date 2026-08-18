import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { env } from '../../config/env';

const COOKIE_NAME = 'eventure_refresh_token';

const parseCookies = (cookieHeader: string | undefined) => {
  const list: Record<string, string> = {};
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    const key = parts.shift()?.trim();
    if (key) {
      list[key] = decodeURI(parts.join('='));
    }
  });
  return list;
};

const setRefreshCookie = (res: Response, token: string) => {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    // maxAge in ms for 7 days
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });
};

const clearRefreshCookie = (res: Response) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fullName, email, password } = req.body;
    // Default registration creates an ATTENDEE. Admins would need to be created manually or via a separate protected route.
    const { accessToken, refreshToken } = await AuthService.register(fullName, email, password, 'ATTENDEE');
    
    setRefreshCookie(res, refreshToken);

    res.status(201).json({
      success: true,
      data: { 
        message: 'Account created successfully',
        accessToken
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await AuthService.login(email, password);
    
    setRefreshCookie(res, refreshToken);
    
    res.status(200).json({
      success: true,
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cookies = parseCookies(req.headers.cookie);
    const refreshToken = cookies[COOKIE_NAME];

    if (!refreshToken) {
      res.status(401).json({
        success: false,
        error: {
          code: 'REFRESH_TOKEN_INVALID',
          message: 'Refresh session is invalid or expired.',
        },
      });
      return;
    }

    try {
      const { accessToken, refreshToken: newRefreshToken } = await AuthService.refresh(refreshToken);
      setRefreshCookie(res, newRefreshToken);
      res.status(200).json({
        success: true,
        data: { accessToken },
      });
    } catch (error) {
      clearRefreshCookie(res);
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cookies = parseCookies(req.headers.cookie);
    const refreshToken = cookies[COOKIE_NAME];

    await AuthService.logout(refreshToken);
    clearRefreshCookie(res);
    
    res.status(200).json({
      success: true,
      data: { message: 'Signed out successfully.' },
    });
  } catch (error) {
    next(error);
  }
};
