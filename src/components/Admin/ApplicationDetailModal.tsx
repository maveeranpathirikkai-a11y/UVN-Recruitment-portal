import React, { useState } from 'react';
import { ApplicationRecord, ApplicationStatus, Language } from '../../types';
import { ApiService } from '../../services/api';
import { X, User, Phone, Mail, MapPin, Briefcase, GraduationCap, FileText, CheckCircle, Save, Loader2, ExternalLink } from 'lucide-react';

interface ApplicationDetailModalProps {
  application: ApplicationRecord | null;
  onClose: () => void;
  onUpdate: () => void;
  currentLang: Language;
}

export const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  application,
  onClose,
  onUpdate,
  currentLang
}) => {
  if (!application) return null;

  const [status, setStatus] = useState<ApplicationStatus>(application.applicationStatus);
  const [notes, setNotes] = useState<string>(application.recruitmentNotes || '');
  const [saving, setSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = async () => {
    setSaving(true);
    setSavedSuccess(false);
    await ApiService.updateApplication(application.applicationId, status, notes);
    setSaving(false);
    setSavedSuccess(true);
    onUpdate();
    setTimeout(() => setSavedSuccess(false), 2500);
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

            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12, marginTop: 12 }}>
              {savedSuccess && (
                <span style={{ color: '#16a34a', fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle size={16} /> Updated successfully!
                </span>
              )}
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
                disabled={saving}
                style={{ padding: '8px 18px' }}
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
