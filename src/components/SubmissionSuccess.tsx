import React from 'react';
import { ApplicationFormData, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { Check, Printer, RefreshCw, Copy, CheckCheck, Newspaper } from 'lucide-react';

interface SubmissionSuccessProps {
  applicationId: string;
  formData: ApplicationFormData;
  currentLang: Language;
  onReset: () => void;
}

export const SubmissionSuccess: React.FC<SubmissionSuccessProps> = ({
  applicationId,
  formData,
  currentLang,
  onReset
}) => {
  const t = TRANSLATIONS[currentLang];
  const [copied, setCopied] = React.useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(applicationId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="success-card">
      {/* Newspaper Header for Printed Slip */}
      <div className="print-only" style={{ display: 'none', textAlign: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: '1.6rem', color: '#7f1d1d' }}>உங்கள் விஜய் நாளிதழ் — UNGAL VIJAY NAALITHAZH</h1>
        <p style={{ fontSize: '0.9rem', color: '#475569' }}>Journalist & Photographer Recruitment Application Receipt</p>
        <hr style={{ margin: '12px 0', border: '1px solid #991b1b' }} />
      </div>

      <div className="success-badge">
        <Check size={40} strokeWidth={3} />
      </div>

      <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary-red)', marginBottom: 8 }}>
        {t.successHeading}
      </h2>

      <p style={{ fontSize: '1.05rem', color: 'var(--color-ink-muted)', maxWidth: 650, margin: '0 auto 20px' }}>
        {t.successSub}
      </p>

      {/* Prominent Application ID Banner */}
      <div className="app-id-banner">
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-ink-muted)', textTransform: 'uppercase', marginBottom: 4 }}>
          {t.yourAppIdIs}
        </div>
        <div className="app-id-code">{applicationId}</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 10 }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCopyId}
            style={{ padding: '4px 12px', fontSize: '0.8rem' }}
          >
            {copied ? <CheckCheck size={14} color="#16a34a" /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy ID'}</span>
          </button>
        </div>
      </div>

      <p style={{ fontSize: '0.875rem', color: 'var(--color-ink-light)', marginBottom: 28 }}>
        {t.keepIdSafe}
      </p>

      {/* Candidate Application Summary Box */}
      <div style={{
        maxWidth: 600,
        margin: '0 auto 32px',
        background: '#f8fafc',
        border: '1px solid var(--color-border)',
        borderRadius: 12,
        padding: '20px 24px',
        textAlign: 'left'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: 'var(--color-primary-red)', marginBottom: 12, borderBottom: '1px solid #e2e8f0', paddingBottom: 8 }}>
          <Newspaper size={18} />
          <span>Application Summary / விண்ணப்ப சுருக்கம்</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', fontSize: '0.9rem' }}>
          <div><strong style={{ color: '#64748b' }}>Candidate:</strong> {formData.fullName}</div>
          <div><strong style={{ color: '#64748b' }}>Position:</strong> {formData.positionAppliedFor}</div>
          <div><strong style={{ color: '#64748b' }}>Location:</strong> {formData.taluk}, {formData.district}</div>
          <div><strong style={{ color: '#64748b' }}>State:</strong> {formData.state}</div>
          <div><strong style={{ color: '#64748b' }}>Contact:</strong> {formData.mobileNumber}</div>
          <div><strong style={{ color: '#64748b' }}>Email:</strong> {formData.email}</div>
          <div><strong style={{ color: '#64748b' }}>Work Type:</strong> {formData.workType}</div>
          <div><strong style={{ color: '#64748b' }}>Experience:</strong> {formData.journalismExperience === 'Yes' ? `${formData.experienceYears} Years` : 'Fresher'}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
        <button
          type="button"
          className="btn btn-gold"
          onClick={handlePrint}
          style={{ padding: '10px 24px' }}
        >
          <Printer size={18} />
          <span>{t.btnPrint}</span>
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={onReset}
          style={{ padding: '10px 24px' }}
        >
          <RefreshCw size={18} />
          <span>{t.btnNewApplication}</span>
        </button>
      </div>
    </div>
  );
};
