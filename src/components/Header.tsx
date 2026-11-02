import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { Globe, ShieldCheck, Newspaper } from 'lucide-react';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  onBackToPortal?: () => void;
  showAdminView?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  onOpenAdmin,
  isAdminLoggedIn,
  onBackToPortal,
  showAdminView
}) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <header className="site-header">
      {/* Newspaper Top Bar */}
      <div className="top-bar">
        <div className="top-bar-quote">
          <span>உண்மையின் ஒளி</span>
          <span>|</span>
          <span>மக்களின் குரல்</span>
          <span>|</span>
          <span>நாட்டு முன்னேற்றம்</span>
        </div>

        <div className="top-bar-actions">
          {/* Language Toggle */}
          <button
            type="button"
            className="lang-toggle-btn"
            onClick={() => onLanguageChange(currentLang === 'ta' ? 'en' : 'ta')}
            title="Switch Language / மொழியை மாற்றுக"
          >
            <Globe size={14} />
            <span>{currentLang === 'ta' ? 'English' : 'தமிழ்'}</span>
          </button>

          {/* Admin Toggle */}
          {showAdminView ? (
            <button
              type="button"
              className="lang-toggle-btn"
              onClick={onBackToPortal}
              title="Return to Public Portal"
            >
              <Newspaper size={14} />
              <span>{currentLang === 'ta' ? 'விண்ணப்ப போர்ட்டல்' : 'Application Portal'}</span>
            </button>
          ) : (
            <button
              type="button"
              className="lang-toggle-btn"
              onClick={onOpenAdmin}
              title="Editorial Admin Login"
            >
              <ShieldCheck size={14} />
              <span>{isAdminLoggedIn ? (currentLang === 'ta' ? 'நிர்வாகப் பலகை' : 'Admin Dashboard') : t.btnAdminLogin}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Masthead displaying the official logo */}
      <div className="header-masthead">
        <a href="/" className="logo-wrapper" onClick={(e) => { e.preventDefault(); if (onBackToPortal) onBackToPortal(); }}>
          <img
            src="/assets/logo.png"
            alt="UNGAL VIJAY NAALITHAZH - Tamil Daily Logo"
            className="logo-img"
            loading="eager"
          />
        </a>

        <div className="header-portal-info">
          <div className="header-portal-title">{t.portalTitle}</div>
          <div className="header-portal-subtitle">{t.portalSubTitle}</div>
        </div>
      </div>
    </header>
  );
};
