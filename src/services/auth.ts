import { AdminUser } from '../types';
import { ApiService } from './api';

const ADMIN_SESSION_KEY = 'uvn_admin_session';

export class AuthService {
  /**
   * Authenticate administrator against server-side Google Apps Script backend
   * Never stores or checks credentials in client code.
   */
  static async login(username: string, password: string): Promise<{ success: boolean; message: string; user?: AdminUser }> {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      return {
        success: false,
        message: 'Username and password are required.'
      };
    }

    try {
      const authResult = await ApiService.adminLogin(cleanUser, cleanPass);
      if (authResult.success && authResult.token) {
        const user: AdminUser = {
          username: authResult.user.username || cleanUser,
          name: authResult.user.name || 'Editorial Administrator',
          role: authResult.user.role || 'admin',
          token: authResult.token,
          expiresAt: authResult.expiresAt
        };
        sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(user));
        return {
          success: true,
          message: authResult.message || 'Login successful',
          user
        };
      }
      return {
        success: false,
        message: authResult.message || 'Authentication failed.'
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Authentication failed: unable to verify administrator credentials.'
      };
    }
  }

  /**
   * Get active authenticated administrator session
   * Verifies session expiry and automatically invalidates expired sessions.
   */
  static getCurrentUser(): AdminUser | null {
    const raw = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;
    try {
      const user: AdminUser = JSON.parse(raw);
      // Auto-expire session if expiry time has passed
      if (user.expiresAt && user.expiresAt < Date.now()) {
        this.logout();
        return null;
      }
      return user;
    } catch {
      return null;
    }
  }

  /**
   * Retrieve active cryptographic administrator session token
   */
  static getAdminToken(): string | null {
    const user = this.getCurrentUser();
    return user?.token || null;
  }

  /**
   * Clear administrator session
   */
  static logout(): void {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  }

  /**
   * Check if current session is active and unexpired
   */
  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}
