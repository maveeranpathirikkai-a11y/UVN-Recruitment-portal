import React from 'react';
import { ApplicationFormData, Language } from '../../types';
import { TRANSLATIONS } from '../../data/translations';
import { CheckSquare, Edit3, MapPin, User, Briefcase, GraduationCap, ShieldCheck, Loader2, Send } from 'lucide-react';

interface Step6Props {
  formData: ApplicationFormData;
  onEditStep: (stepNumber: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submissionError: string | null;
  currentLang: Language;
}

export const Step6Review: React.FC<Step6Props> = ({
  formData,
  onEditStep,
  onSubmit,
  isSubmitting,
  submissionError,
  currentLang
}) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <div className="step-content">
      <div className="section-header">
        <h2 className="section-title">
          <CheckSquare size={24} />
          {t.step6Title}
        </h2>
        <p className="section-subtitle">{t.reviewPrompt}</p>
      </div>

      {submissionError && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #f87171',
          color: '#991b1b',
          padding: '14px 18px',
          borderRadius: 8,
          marginBottom: 20,
          fontWeight: 600,
          fontSize: '0.9rem'
        }}>
          {submissionError}
        </div>
      )}

      {/* Section 1: Location Review */}
      <div className="review-section">
        <div className="review-section-header">
          <div className="review-section-title">
            <MapPin size={18} />
            <span>{t.step1Title}</span>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onEditStep(1)}
            style={{ padding: '4px 12px', fontSize: '0.8rem' }}
          >
            <Edit3 size={14} />
            <span>{t.btnEdit}</span>
          </button>
        </div>
        <div className="review-grid">
          <div>
            <div className="review-item-label">{t.stateLabel}</div>
            <div className="review-item-value">{formData.state || '—'}</div>
          </div>
          <div>
            <div className="review-item-label">{t.districtLabel}</div>
            <div className="review-item-value">{formData.district || '—'}</div>
          </div>
          <div>
            <div className="review-item-label">{t.talukLabel}</div>
            <div className="review-item-value">{formData.taluk || '—'}</div>
          </div>
          <div>
            <div className="review-item-label">{t.villageTownLabel}</div>
            <div className="review-item-value">{formData.villageTown || '—'}</div>
          </div>
        </div>
      </div>

      {/* Section 2: Personal Details Review */}
      <div className="review-section">
        <div className="review-section-header">
          <div className="review-section-title">
            <User size={18} />
            <span>{t.step2Title}</span>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onEditStep(2)}
            style={{ padding: '4px 12px', fontSize: '0.8rem' }}
          >
            <Edit3 size={14} />
            <span>{t.btnEdit}</span>
          </button>
        </div>
        <div className="review-grid">
          <div>
            <div className="review-item-label">{t.fullNameLabel}</div>
            <div className="review-item-value">{formData.fullName || '—'}</div>
          </div>
          <div>
            <div className="review-item-label">{t.guardianNameLabel}</div>
            <div className="review-item-value">{formData.guardianName || '—'}</div>
          </div>
          <div>
            <div className="review-item-label">{t.mobileLabel}</div>
            <div className="review-item-value">{formData.mobileNumber || '—'}</div>
          </div>
          <div>
            <div className="review-item-label">{t.whatsappLabel}</div>
            <div className="review-item-value">{formData.whatsAppNumber || formData.mobileNumber || '—'}</div>
          </div>
          <div>
            <div className="review-item-label">{t.emailLabel}</div>
            <div className="review-item-value">{formData.email || '—'}</div>
          </div>
          <div>
            <div className="review-item-label">{t.pinCodeLabel}</div>
            <div className="review-item-value">{formData.pinCode || '—'}</div>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <div className="review-item-label">{t.addressLabel}</div>
            <div className="review-item-value">{formData.residentialAddress || '—'}</div>
          </div>
        </div>
      </div>

      {/* Section 3: Position & Preferences Review */}
      <div className="review-section">
        <div className="review-section-header">
          <div className="review-section-title">
            <Briefcase size={18} />
            <span>{t.step3Title}</span>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onEditStep(3)}
            style={{ padding: '4px 12px', fontSize: '0.8rem' }}
          >
            <Edit3 size={14} />
            <span>{t.btnEdit}</span>
          </button>
        </div>
        <div className="review-grid">
          <div>
            <div className="review-item-label">{t.positionLabel}</div>
            <div className="review-item-value" style={{ color: 'var(--color-primary-red)', fontWeight: 800 }}>
              {formData.positionAppliedFor || '—'}
            </div>
          </div>
          <div>
            <div className="review-item-label">{t.workTypeLabel}</div>
            <div className="review-item-value">{formData.workType}</div>
          </div>
          <div>
            <div className="review-item-label">{t.prefAreaLabel}</div>
            <div className="review-item-value">{formData.preferredReportingArea || '—'}</div>
          </div>
          <div>
            <div className="review-item-label">{t.travelLabel}</div>
            <div className="review-item-value">{formData.travelAvailability}</div>
          </div>
          <div>
            <div className="review-item-label">{t.cameraLabel}</div>
            <div className="review-item-value">{formData.cameraAvailability}</div>
          </div>
          <div>
            <div className="review-item-label">{t.tamilWritingLabel}</div>
            <div className="review-item-value">{formData.tamilNewsWritingAbility}</div>
          </div>
        </div>
      </div>

      {/* Section 4: Education & Experience Review */}
      <div className="review-section">
        <div className="review-section-header">
          <div className="review-section-title">
            <GraduationCap size={18} />
            <span>{t.step4Title}</span>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onEditStep(4)}
            style={{ padding: '4px 12px', fontSize: '0.8rem' }}
          >
            <Edit3 size={14} />
            <span>{t.btnEdit}</span>
          </button>
        </div>
        <div className="review-grid">
          <div>
            <div className="review-item-label">{t.eduQualificationLabel}</div>
            <div className="review-item-value">{formData.educationalQualification || '—'}</div>
          </div>
          <div>
            <div className="review-item-label">{t.courseNameLabel}</div>
            <div className="review-item-value">{formData.courseName || '—'}</div>
          </div>
          <div>
            <div className="review-item-label">{t.journalismExpLabel}</div>
            <div className="review-item-value">
              {formData.journalismExperience === 'Yes'
                ? `${currentLang === 'ta' ? 'அனுபவம் உண்டு' : 'Experienced'} (${formData.experienceYears} Years)`
                : (currentLang === 'ta' ? 'புதியவர் (Fresher)' : 'Fresher')}
            </div>
          </div>
          {formData.journalismExperience === 'Yes' && (
            <div>
              <div className="review-item-label">{t.prevOrgLabel}</div>
              <div className="review-item-value">{formData.previousOrganisation || '—'}</div>
            </div>
          )}
          <div>
            <div className="review-item-label">{t.languagesLabel}</div>
            <div className="review-item-value">{formData.languagesKnown?.join(', ') || 'Tamil'}</div>
          </div>
        </div>
      </div>

      {/* Section 5: Documents & Consent Status */}
      <div className="review-section">
        <div className="review-section-header">
          <div className="review-section-title">
            <ShieldCheck size={18} />
            <span>{t.step5Title}</span>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onEditStep(5)}
            style={{ padding: '4px 12px', fontSize: '0.8rem' }}
          >
            <Edit3 size={14} />
            <span>{t.btnEdit}</span>
          </button>
        </div>
        <div className="review-grid">
          <div>
            <div className="review-item-label">Resume / Documents</div>
            <div className="review-item-value">
              {formData.resumeFileName ? `Attached: ${formData.resumeFileName}` : 'None uploaded (Optional)'}
            </div>
          </div>
          <div>
            <div className="review-item-label">{t.idReferenceLabel}</div>
            <div className="review-item-value">{formData.identityReference ? `•••• ${formData.identityReference}` : 'Not provided'}</div>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <div className="review-item-label">Consent & Declarations</div>
            <div className="review-item-value" style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckSquare size={16} /> All 3 Mandatory Declarations Confirmed
            </div>
          </div>
        </div>
      </div>

      {/* Submit Action Area */}
      <div style={{ textAlign: 'center', marginTop: 28 }}>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onSubmit}
          disabled={isSubmitting}
          style={{ minWidth: 260, padding: '14px 32px', fontSize: '1.05rem' }}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>{t.btnSubmitting}</span>
            </>
          ) : (
            <>
              <Send size={20} />
              <span>{t.btnSubmit}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
