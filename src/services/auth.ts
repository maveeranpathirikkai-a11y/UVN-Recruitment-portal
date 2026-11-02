import { AdminUser } from '../types';

const ADMIN_SESSION_KEY = 'uvn_admin_session';

export class AuthService {
  private static readonly CREDENTIALS = {
    username: 'admin',
    passwordHash: 'uvn2026' // Demo editorial admin credentials
  };

  static login(username: string, password: string): { success: boolean; message: string; user?: AdminUser } {
    if (username.trim().toLowerCase() === this.CREDENTIALS.username && password === this.CREDENTIALS.passwordHash) {
      const user: AdminUser = {
        username: 'admin',
        name: 'Editorial Administrator',
        role: 'admin'
      };
      sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(user));
      return {
        success: true,
        message: 'Login successful',
        user
      };
    }

    return {
      success: false,
      message: 'Invalid administrative username or password.'
    };
  }

  static getCurrentUser(): AdminUser | null {
    const raw = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  static logout(): void {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}
