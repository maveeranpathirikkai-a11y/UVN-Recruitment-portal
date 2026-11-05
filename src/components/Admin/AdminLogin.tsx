import React, { useState } from 'react';
import { AuthService } from '../../services/auth';
import { Language, AdminUser } from '../../types';
import { ShieldCheck, Lock, User, AlertCircle, X, Loader2 } from 'lucide-react';

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AdminUser) => void;
  currentLang: Language;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentLang
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await AuthService.login(username, password);
      if (result.success && result.user) {
        onLoginSuccess(result.user);
        onClose();
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShieldCheck size={24} color="var(--color-primary-red)" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary-red)' }}>
              {currentLang === 'ta' ? 'ஆசிரியர் குழு நிர்வாக உள்நுழைவு' : 'Editorial Admin Login'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={{ background: 'none', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', padding: 4 }}
          >
            <X size={20} color="#64748b" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#fef2f2',
              color: '#991b1b',
              padding: '10px 14px',
              borderRadius: 8,
              marginBottom: 16,
              fontSize: '0.85rem',
              fontWeight: 600
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="form-label" htmlFor="admin-user-input">
              <span>{currentLang === 'ta' ? 'பயனர் பெயர்' : 'Username'}</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-user-input"
                type="text"
                className="form-input"
                style={{ paddingLeft: 36 }}
                value={username}
                disabled={loading}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <User size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 12 }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 20 }}>
            <label className="form-label" htmlFor="admin-pass-input">
              <span>{currentLang === 'ta' ? 'கடவுச்சொல்' : 'Password'}</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-pass-input"
                type="password"
                className="form-input"
                style={{ paddingLeft: 36 }}
                placeholder="••••••••"
                value={password}
                disabled={loading}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 12 }} />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>{currentLang === 'ta' ? 'சரிபார்க்கிறது...' : 'Verifying credentials...'}</span>
              </>
            ) : (
              <span>{currentLang === 'ta' ? 'உள்நுழைக' : 'Sign In to Dashboard'}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
