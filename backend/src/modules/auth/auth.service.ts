import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { User, IUser } from './auth.model';
import { AppError } from '../../utils/AppError';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { compareBcryptHash } from '../../utils/tokenCompare';

export class AuthService {
  static async register(fullName: string, email: string, passwordPlain: string, role: 'ADMIN' | 'ATTENDEE' = 'ATTENDEE'): Promise<{ accessToken: string; refreshToken: string }> {
    const existing = await User.findOne({ email });
    if (existing) {
      throw new AppError('Email already exists', 409, 'CONFLICT');
    }

    const passwordHash = await bcrypt.hash(passwordPlain, 10);
    const user = new User({ fullName, email, passwordHash, role });
    await user.save();
    return this.generateTokens(user);
  }

  static async login(email: string, passwordPlain: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw this.unauthorizedError();
    }

    const isMatch = await compareBcryptHash(passwordPlain, user.passwordHash);
    if (!isMatch) {
      throw this.unauthorizedError();
    }

    return this.generateTokens(user);
  }

  static async refresh(refreshTokenRaw: string) {
    let payload;
    try {
      payload = verifyRefreshToken(refreshTokenRaw);
    } catch (e) {
      throw this.invalidRefreshError();
    }

    const user = await User.findById(payload.id);
    if (!user || !user.refreshTokenHash) {
      throw this.invalidRefreshError();
    }

    const sha256Hash = crypto.createHash('sha256').update(refreshTokenRaw).digest('hex');
    const isValid = await compareBcryptHash(sha256Hash, user.refreshTokenHash);
    if (!isValid) {
      // Security: Token reuse detected or invalid token presented
      user.refreshTokenHash = null;
      await user.save();
      throw this.invalidRefreshError();
    }

    return this.generateTokens(user);
  }

  static async logout(refreshTokenRaw: string | undefined) {
    if (!refreshTokenRaw) return;
    
    try {
      const payload = verifyRefreshToken(refreshTokenRaw);
      const user = await User.findById(payload.id);
      if (user) {
        user.refreshTokenHash = null;
        await user.save();
      }
    } catch (e) {
      // If token is invalid or expired, we can't securely identify the user.
      // But it's already invalid, so logout is effectively true on the client.
    }
  }

  private static async generateTokens(user: IUser) {
    const payload = { id: user._id.toString(), email: user.email, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // Hash refresh token before saving (Bcrypt truncates at 72 bytes, so we sha256 it first)
    const sha256Hash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    user.refreshTokenHash = await bcrypt.hash(sha256Hash, 10);
    await user.save();

    return { accessToken, refreshToken };
  }

  private static unauthorizedError() {
    return new AppError('Email or password is incorrect.', 401, 'UNAUTHORIZED');
  }

  private static invalidRefreshError() {
    return new AppError('Refresh session is invalid or expired.', 401, 'REFRESH_TOKEN_INVALID');
  }
}
