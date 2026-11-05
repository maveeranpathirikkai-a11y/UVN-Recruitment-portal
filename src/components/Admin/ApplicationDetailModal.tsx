import React, { useState } from 'react';
import { ApplicationRecord, ApplicationStatus, Language } from '../../types';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';
import { X, Phone, Mail, MapPin, Briefcase, CheckCircle, Save, Loader2, ExternalLink, Trash2, AlertTriangle } from 'lucide-react';

interface ApplicationDetailModalProps {
  application: ApplicationRecord | null;
  onClose: () => void;
  onUpdate: () => void;
  onRemove?: () => void;
  currentLang: Language;
}

export const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  application,
  onClose,
  onUpdate,
  onRemove,
  currentLang
}) => {
  const isAuthorized = AuthService.isAuthenticated();
  const [status, setStatus] = useState<ApplicationStatus>(application?.applicationStatus || 'New');
  const [notes, setNotes] = useState<string>(application?.recruitmentNotes || '');
  const [saving, setSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Admin Remove Application states
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<boolean>(false);
  const [removing, setRemoving] = useState<boolean>(false);
  const [removeSuccess, setRemoveSuccess] = useState<boolean>(false);
  const [removeError, setRemoveError] = useState<string | null>(null);

  if (!application) return null;

  const handleSave = async () => {
    setSaving(true);
    setSavedSuccess(false);
    setSaveError(null);
    try {
      await ApiService.updateApplication(application.applicationId, status, notes);
      setSaving(false);
      setSavedSuccess(true);
      onUpdate();
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setSaving(false);
      setSaveError(err.message || 'Failed to update application in Google Sheets.');
    }
  };

  const handleRemove = async () => {
    setRemoving(true);
    setRemoveError(null);
    try {
      await ApiService.deleteApplication(application.applicationId);
      setRemoving(false);
      setRemoveSuccess(true);
      setTimeout(() => {
        if (onRemove) {
          onRemove();
        } else {
          onUpdate();
          onClose();
        }
      }, 1000);
    } catch (err: any) {
      setRemoving(false);
      setRemoveError(err.message || 'Failed to remove application from Google Sheets.');
    }
  };

  const statusOptions: ApplicationStatus[] = [
    'New',
    'Under Review',
    'Shortlisted',
    'Interview Scheduled',
    'Selected',
    'Rejected'
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 840 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className={`status-pill status-${application.applicationStatus.replace(/\s+/g, '')}`}>
              {application.applicationStatus}
            </span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-ink)' }}>
              {application.fullName}
            </h2>
            <span style={{ fontSize: '0.9rem', color: '#64748b', fontFamily: 'monospace' }}>
              ({application.applicationId})
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          >
            <X size={20} color="#64748b" />
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {/* Quick Contact & Role Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 12,
            background: '#f8fafc',
            border: '1px solid var(--color-border)',
            borderRadius: 8,
            padding: 14,
            marginBottom: 20
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Briefcase size={16} color="var(--color-primary-red)" />
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Position</div>
                <div style={{ fontWeight: 700, color: 'var(--color-primary-red)' }}>{application.positionAppliedFor}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Phone size={16} color="#0284c7" />
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Phone & WhatsApp</div>
                <div style={{ fontWeight: 600 }}>{application.mobileNumber}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Mail size={16} color="#7c3aed" />
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Email</div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{application.email}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <MapPin size={16} color="#059669" />
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Location</div>
                <div style={{ fontWeight: 600 }}>{application.taluk}, {application.district}</div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="review-grid" style={{ padding: 0, gap: '14px 20px', marginBottom: 24 }}>
            <div>
              <div className="review-item-label">State / Region</div>
              <div className="review-item-value">{application.state}</div>
            </div>

            <div>
              <div className="review-item-label">Work Type & Travel</div>
              <div className="review-item-value">{application.workType} | Travel: {application.travelAvailability}</div>
            </div>

            <div>
              <div className="review-item-label">Education</div>
              <div className="review-item-value">{application.educationalQualification} {application.courseName ? `(${application.courseName})` : ''}</div>
            </div>

            <div>
              <div className="review-item-label">Journalism Experience</div>
              <div className="review-item-value">
                {application.journalismExperience === 'Yes' 
                  ? `${application.experienceYears} Years (${application.previousOrganisation || 'Media'})` 
                  : 'Fresher'}
              </div>
            </div>

            <div>
              <div className="review-item-label">Camera & Gear</div>
              <div className="review-item-value">Own Camera: {application.cameraAvailability} | Driving: {application.drivingLicence}</div>
            </div>

            <div>
              <div className="review-item-label">Tamil Writing & Video Reporting</div>
              <div className="review-item-value">Tamil Writing: {application.tamilNewsWritingAbility} | Video: {application.videoReportingAbility}</div>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <div className="review-item-label">Residential Address</div>
              <div className="review-item-value">{application.residentialAddress} - PIN: {application.pinCode}</div>
            </div>

            {application.portfolioUrl && (
              <div style={{ gridColumn: 'span 2' }}>
                <div className="review-item-label">Portfolio URL</div>
                <div className="review-item-value">
                  <a href={application.portfolioUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary-red)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {application.portfolioUrl} <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            )}

            {application.youtubeUrl && (
              <div style={{ gridColumn: 'span 2' }}>
                <div className="review-item-label">YouTube URL</div>
                <div className="review-item-value">
                  <a href={application.youtubeUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#dc2626', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {application.youtubeUrl} <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            )}

            {application.motivation && (
              <div style={{ gridColumn: 'span 2' }}>
                <div className="review-item-label">Motivation to Join</div>
                <div className="review-item-value" style={{ fontStyle: 'italic', background: '#fafafa', padding: 8, borderRadius: 6 }}>
                  "{application.motivation}"
                </div>
              </div>
            )}

            {application.identityReference && (
              <div>
                <div className="review-item-label">ID Verification Reference (Last 4)</div>
                <div className="review-item-value">•••• {application.identityReference}</div>
              </div>
            )}

            <div>
              <div className="review-item-label">Submitted On</div>
              <div className="review-item-value">{new Date(application.timestamp).toLocaleString()}</div>
            </div>
          </div>

          {/* Admin Status & Notes Action Box */}
          <div style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: 8,
            padding: 18,
            marginTop: 10
          }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#92400e', marginBottom: 12 }}>
              Recruitment Decision & Editorial Notes (Confidential)
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="status-select">Application Status</label>
                <select
                  id="status-select"
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="admin-notes">Private Recruitment Notes</label>
                <textarea
                  id="admin-notes"
                  className="form-textarea"
                  style={{ minHeight: 60 }}
                  placeholder="e.g. Cleared telephonic round; schedule camera practical test on Nov 10..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            {saveError && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fca5a5',
                color: '#991b1b',
                padding: '8px 12px',
                borderRadius: 6,
                fontSize: '0.825rem',
                fontWeight: 600,
                marginTop: 10
              }}>
                {saveError}
              </div>
            )}

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12,
              marginTop: 14,
              paddingTop: 12,
              borderTop: '1px solid #fde68a'
            }}>
              {isAuthorized && (
                <button
                  type="button"
                  onClick={() => {
                    setShowRemoveConfirm(true);
                    setRemoveError(null);
                  }}
                  disabled={saving || removing}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '7px 14px',
                    background: '#ffffff',
                    border: '1px solid #ef4444',
                    borderRadius: 6,
                    color: '#dc2626',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    cursor: (saving || removing) ? 'not-allowed' : 'pointer'
                  }}
                >
                  <Trash2 size={15} />
                  <span>{currentLang === 'ta' ? 'விண்ணப்பத்தை நீக்கு' : 'Remove Application'}</span>
                </button>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto' }}>
                {savedSuccess && (
                  <span style={{ color: '#16a34a', fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <CheckCircle size={16} /> Updated successfully in Google Sheets!
                  </span>
                )}
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={saving || removing}
                  style={{ padding: '8px 18px' }}
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  <span>Save Changes</span>
                </button>
              </div>
            </div>

            {/* Admin-only Application Removal Confirmation Dialog */}
            {showRemoveConfirm && (
              <div style={{
                marginTop: 14,
                background: '#fef2f2',
                border: '1.5px solid #f87171',
                borderRadius: 8,
                padding: 16
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <AlertTriangle size={22} color="#dc2626" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '0.925rem', fontWeight: 700, color: '#991b1b' }}>
                      {currentLang === 'ta' ? 'விண்ணப்பத்தை நீக்குவதை உறுதிப்படுத்தவும்' : 'Confirm Application Removal'}
                    </h4>
                    <p style={{ margin: '0 0 10px 0', fontSize: '0.825rem', color: '#7f1d1d' }}>
                      {currentLang === 'ta'
                        ? 'இந்த விண்ணப்பதாரரை ஆட்சேர்ப்பு தரவுத்தளத்தில் இருந்து நிரந்தரமாக நீக்க விரும்புகிறீர்களா? இந்த செயல்முறை மாற்ற முடியாதது.'
                        : 'Are you sure you want to permanently remove this application from the recruitment database? This action cannot be undone.'}
                    </p>

                    <div style={{
                      background: '#ffffff',
                      border: '1px solid #fecaca',
                      borderRadius: 6,
                      padding: '8px 12px',
                      fontSize: '0.825rem',
                      marginBottom: 12
                    }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 12px' }}>
                        <span style={{ color: '#64748b', fontWeight: 600 }}>Candidate Name:</span>
                        <strong style={{ color: '#0f172a' }}>{application.fullName}</strong>
                        <span style={{ color: '#64748b', fontWeight: 600 }}>Application ID:</span>
                        <code style={{ color: '#991b1b', fontWeight: 700 }}>{application.applicationId}</code>
                        <span style={{ color: '#64748b', fontWeight: 600 }}>Position:</span>
                        <span>{application.positionAppliedFor}</span>
                      </div>
                    </div>

                    {removeError && (
                      <div style={{
                        background: '#fee2e2',
                        border: '1px solid #ef4444',
                        color: '#991b1b',
                        padding: '6px 10px',
                        borderRadius: 6,
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        marginBottom: 10
                      }}>
                        {removeError}
                      </div>
                    )}

                    {removeSuccess && (
                      <div style={{
                        background: '#dcfce7',
                        border: '1px solid #22c55e',
                        color: '#15803d',
                        padding: '6px 10px',
                        borderRadius: 6,
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        marginBottom: 10,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}>
                        <CheckCircle size={15} />
                        {currentLang === 'ta' ? 'விண்ணப்பம் வெற்றிகரமாக நீக்கப்பட்டது!' : 'Application removed successfully from Google Sheets!'}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        disabled={removing || removeSuccess}
                        onClick={() => setShowRemoveConfirm(false)}
                        style={{
                          padding: '6px 14px',
                          background: '#ffffff',
                          border: '1px solid #cbd5e1',
                          borderRadius: 6,
                          fontSize: '0.825rem',
                          fontWeight: 600,
                          color: '#475569',
                          cursor: 'pointer'
                        }}
                      >
                        {currentLang === 'ta' ? 'ரத்துசெய்' : 'Cancel'}
                      </button>
                      <button
                        type="button"
                        disabled={removing || removeSuccess}
                        onClick={handleRemove}
                        style={{
                          padding: '6px 16px',
                          background: '#dc2626',
                          border: 'none',
                          borderRadius: 6,
                          fontSize: '0.825rem',
                          fontWeight: 700,
                          color: '#ffffff',
                          cursor: (removing || removeSuccess) ? 'not-allowed' : 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                      >
                        {removing ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        <span>{currentLang === 'ta' ? 'ஆம், விண்ணப்பத்தை நீக்கு' : 'Yes, Remove Application'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
