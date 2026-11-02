import React, { useState } from 'react';
import { AuthService } from '../../services/auth';
import { Language, AdminUser } from '../../types';
import { ShieldCheck, Lock, User, AlertCircle, X } from 'lucide-react';

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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = AuthService.login(username, password);
    if (result.success && result.user) {
      onLoginSuccess(result.user);
      onClose();
    } else {
      setError(result.message);
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
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
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
              <AlertCircle size={16} />
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
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 12 }} />
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 4 }}>
              Default credential: <code>admin</code> / <code>uvn2026</code>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px' }}
          >
            {currentLang === 'ta' ? 'உள்நுழைக' : 'Sign In to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};
