import bcrypt from 'bcryptjs';
import { AdminUser, IAdminUser } from './auth.model';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { compareBcryptHash } from '../../utils/tokenCompare';

export class AuthService {
  static async registerAdmin(fullName: string, email: string, passwordPlain: string): Promise<{ accessToken: string; refreshToken: string }> {
    const existing = await AdminUser.findOne({ email });
    if (existing) {
      const error: any = new Error('Email already exists');
      error.statusCode = 409;
      error.code = 'CONFLICT';
      throw error;
    }

    const passwordHash = await bcrypt.hash(passwordPlain, 10);
    const admin = new AdminUser({ fullName, email, passwordHash });
    await admin.save();
    return this.generateTokens(admin);
  }

  static async login(email: string, passwordPlain: string) {
    const admin = await AdminUser.findOne({ email });
    if (!admin) {
      throw this.unauthorizedError();
    }

    const isMatch = await compareBcryptHash(passwordPlain, admin.passwordHash);
    if (!isMatch) {
      throw this.unauthorizedError();
    }

    return this.generateTokens(admin);
  }

  static async refresh(refreshTokenRaw: string) {
    let payload;
    try {
      payload = verifyRefreshToken(refreshTokenRaw);
    } catch (e) {
      throw this.invalidRefreshError();
    }

    const admin = await AdminUser.findById(payload.id);
    if (!admin || !admin.refreshTokenHash) {
      throw this.invalidRefreshError();
    }

    const isValid = await compareBcryptHash(refreshTokenRaw, admin.refreshTokenHash);
    if (!isValid) {
      // Security: Token reuse detected or invalid token presented
      admin.refreshTokenHash = null;
      await admin.save();
      throw this.invalidRefreshError();
    }

    return this.generateTokens(admin);
  }

  static async logout(refreshTokenRaw: string | undefined) {
    if (!refreshTokenRaw) return;
    
    try {
      const payload = verifyRefreshToken(refreshTokenRaw);
      const admin = await AdminUser.findById(payload.id);
      if (admin) {
        admin.refreshTokenHash = null;
        await admin.save();
      }
    } catch (e) {
      // If token is invalid or expired, we can't securely identify the admin.
      // But it's already invalid, so logout is effectively true on the client.
    }
  }

  private static async generateTokens(admin: IAdminUser) {
    const payload = { id: admin._id.toString(), email: admin.email };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // Hash refresh token before saving
    admin.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await admin.save();

    return { accessToken, refreshToken };
  }

  private static unauthorizedError() {
    const err: any = new Error('Email or password is incorrect.');
    err.statusCode = 401;
    err.code = 'UNAUTHORIZED';
    return err;
  }

  private static invalidRefreshError() {
    const err: any = new Error('Refresh session is invalid or expired.');
    err.statusCode = 401;
    err.code = 'REFRESH_TOKEN_INVALID';
    return err;
  }
}
