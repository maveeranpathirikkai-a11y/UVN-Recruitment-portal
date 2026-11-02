import React from 'react';
import { ApplicationFormData, Language, PositionType } from '../../types';
import { TRANSLATIONS } from '../../data/translations';
import { Briefcase, Camera, Video, Newspaper, Compass, Calendar, CheckCircle2 } from 'lucide-react';

interface Step3Props {
  formData: ApplicationFormData;
  updateFormData: (fields: Partial<ApplicationFormData>) => void;
  currentLang: Language;
  errors: Record<string, string>;
}

export const Step3Position: React.FC<Step3Props> = ({
  formData,
  updateFormData,
  currentLang,
  errors
}) => {
  const t = TRANSLATIONS[currentLang];

  const positions: { id: PositionType; title: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'Reporter',
      title: t.positionReporter,
      desc: t.positionReporterDesc,
      icon: <Newspaper size={26} />
    },
    {
      id: 'Photojournalist',
      title: t.positionPhotojournalist,
      desc: t.positionPhotojournalistDesc,
      icon: <Camera size={26} />
    },
    {
      id: 'Video Journalist',
      title: t.positionVideoJournalist,
      desc: t.positionVideoJournalistDesc,
      icon: <Video size={26} />
    }
  ];

  return (
    <div className="step-content">
      <div className="section-header">
        <h2 className="section-title">
          <Briefcase size={24} />
          {t.step3Title}
        </h2>
        <p className="section-subtitle">{t.step3Sub}</p>
      </div>

      {/* Position Cards Selection */}
      <div className="form-group" style={{ marginBottom: 24 }}>
        <label className="form-label">
          <span>
            {t.positionLabel}
            <span className="required-badge">*</span>
          </span>
        </label>

        <div className="position-grid">
          {positions.map((pos) => {
            const isSelected = formData.positionAppliedFor === pos.id;
            return (
              <div
                key={pos.id}
                className={`position-card ${isSelected ? 'selected' : ''}`}
                onClick={() => updateFormData({ positionAppliedFor: pos.id })}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    updateFormData({ positionAppliedFor: pos.id });
                  }
                }}
              >
                {isSelected && (
                  <div style={{ position: 'absolute', top: 12, right: 12, color: 'var(--color-primary-red)' }}>
                    <CheckCircle2 size={20} fill="#fef2f2" />
                  </div>
                )}
                <div className="position-icon">{pos.icon}</div>
                <div className="position-card-title">{pos.title}</div>
                <div className="position-card-desc">{pos.desc}</div>
              </div>
            );
          })}
        </div>
        {errors.positionAppliedFor && (
          <span className="error-text" style={{ display: 'block', marginTop: -8 }}>
            {errors.positionAppliedFor}
          </span>
        )}
      </div>

      <div className="form-grid">
        {/* Preferred Reporting Area / Beat */}
        <div className="form-group">
          <label className="form-label" htmlFor="pref-area-input">
            <span>
              <Compass size={15} style={{ display: 'inline', marginRight: 4 }} />
              {t.prefAreaLabel}
            </span>
          </label>
          <input
            id="pref-area-input"
            type="text"
            className="form-input"
            placeholder={t.prefAreaPlaceholder}
            value={formData.preferredReportingArea}
            onChange={(e) => updateFormData({ preferredReportingArea: e.target.value })}
          />
        </div>

        {/* Work Type */}
        <div className="form-group">
          <label className="form-label">
            <span>
              {t.workTypeLabel}
              <span className="required-badge">*</span>
            </span>
          </label>
          <div className="radio-group" style={{ marginTop: 8 }}>
            <label className="custom-radio">
              <input
                type="radio"
                name="workType"
                value="Full-time"
                checked={formData.workType === 'Full-time'}
                onChange={() => updateFormData({ workType: 'Full-time' })}
              />
              <span>{t.workTypeFull}</span>
            </label>
            <label className="custom-radio">
              <input
                type="radio"
                name="workType"
                value="Part-time"
                checked={formData.workType === 'Part-time'}
                onChange={() => updateFormData({ workType: 'Part-time' })}
              />
              <span>{t.workTypePart}</span>
            </label>
          </div>
        </div>

        {/* Travel Availability */}
        <div className="form-group">
          <label className="form-label">
            <span>{t.travelLabel}</span>
          </label>
          <div className="radio-group" style={{ marginTop: 8 }}>
            <label className="custom-radio">
              <input
                type="radio"
                name="travelAvailability"
                value="Yes"
                checked={formData.travelAvailability === 'Yes'}
                onChange={() => updateFormData({ travelAvailability: 'Yes' })}
              />
              <span>{currentLang === 'ta' ? 'ஆம் (Yes)' : 'Yes'}</span>
            </label>
            <label className="custom-radio">
              <input
                type="radio"
                name="travelAvailability"
                value="No"
                checked={formData.travelAvailability === 'No'}
                onChange={() => updateFormData({ travelAvailability: 'No' })}
              />
              <span>{currentLang === 'ta' ? 'இல்லை (No)' : 'No'}</span>
            </label>
          </div>
        </div>

        {/* Two-wheeler / Driving Licence */}
        <div className="form-group">
          <label className="form-label" htmlFor="licence-select">
            <span>{t.drivingLicenceLabel}</span>
          </label>
          <select
            id="licence-select"
            className="form-select"
            value={formData.drivingLicence}
            onChange={(e) => updateFormData({ drivingLicence: e.target.value as any })}
          >
            <option value="">-- Select --</option>
            <option value="Yes">{currentLang === 'ta' ? 'ஆம் (வாகனம் & உரிமம் உள்ளது)' : 'Yes (Vehicle & Licence Available)'}</option>
            <option value="Learning">{currentLang === 'ta' ? 'எல்.எல்.ஆர் / கற்றல் உரிமம்' : 'Learning Licence / LLR'}</option>
            <option value="No">{currentLang === 'ta' ? 'இல்லை' : 'No'}</option>
          </select>
        </div>

        {/* Own Camera Available (Highlighted if Photojournalist or Video Journalist) */}
        <div className={`form-group ${formData.positionAppliedFor === 'Photojournalist' || formData.positionAppliedFor === 'Video Journalist' ? 'col-span-2' : ''}`}
             style={formData.positionAppliedFor === 'Photojournalist' || formData.positionAppliedFor === 'Video Journalist' ? { background: '#fffbeb', padding: 14, borderRadius: 8, border: '1px solid #fde68a' } : undefined}>
          <label className="form-label">
            <span>
              {t.cameraLabel}
              {(formData.positionAppliedFor === 'Photojournalist') && <span className="required-badge">* (Essential for Photojournalists)</span>}
            </span>
          </label>
          <div className="radio-group" style={{ marginTop: 8 }}>
            <label className="custom-radio">
              <input
                type="radio"
                name="cameraAvailability"
                value="Yes"
                checked={formData.cameraAvailability === 'Yes'}
                onChange={() => updateFormData({ cameraAvailability: 'Yes' })}
              />
              <span>{currentLang === 'ta' ? 'ஆம் (சொந்த கேமரா உள்ளது)' : 'Yes (Own camera available)'}</span>
            </label>
            <label className="custom-radio">
              <input
                type="radio"
                name="cameraAvailability"
                value="No"
                checked={formData.cameraAvailability === 'No'}
                onChange={() => updateFormData({ cameraAvailability: 'No' })}
              />
              <span>{currentLang === 'ta' ? 'இல்லை' : 'No'}</span>
            </label>
            <label className="custom-radio">
              <input
                type="radio"
                name="cameraAvailability"
                value="Not Applicable"
                checked={formData.cameraAvailability === 'Not Applicable'}
                onChange={() => updateFormData({ cameraAvailability: 'Not Applicable' })}
              />
              <span>{currentLang === 'ta' ? 'பொருந்தாது (N/A)' : 'Not Applicable'}</span>
            </label>
          </div>
        </div>

        {/* Smartphone suitable for reporting */}
        <div className="form-group">
          <label className="form-label">
            <span>{t.smartphoneLabel}</span>
          </label>
          <div className="radio-group" style={{ marginTop: 8 }}>
            <label className="custom-radio">
              <input
                type="radio"
                name="smartphoneAvailability"
                value="Yes"
                checked={formData.smartphoneAvailability === 'Yes'}
                onChange={() => updateFormData({ smartphoneAvailability: 'Yes' })}
              />
              <span>{currentLang === 'ta' ? 'ஆம் (Yes)' : 'Yes'}</span>
            </label>
            <label className="custom-radio">
              <input
                type="radio"
                name="smartphoneAvailability"
                value="No"
                checked={formData.smartphoneAvailability === 'No'}
                onChange={() => updateFormData({ smartphoneAvailability: 'No' })}
              />
              <span>{currentLang === 'ta' ? 'இல்லை (No)' : 'No'}</span>
            </label>
          </div>
        </div>

        {/* Video capture capability */}
        <div className="form-group">
          <label className="form-label">
            <span>{t.videoReportLabel}</span>
          </label>
          <div className="radio-group" style={{ marginTop: 8 }}>
            <label className="custom-radio">
              <input
                type="radio"
                name="videoReportingAbility"
                value="Yes"
                checked={formData.videoReportingAbility === 'Yes'}
                onChange={() => updateFormData({ videoReportingAbility: 'Yes' })}
              />
              <span>{currentLang === 'ta' ? 'ஆம் (Yes)' : 'Yes'}</span>
            </label>
            <label className="custom-radio">
              <input
                type="radio"
                name="videoReportingAbility"
                value="No"
                checked={formData.videoReportingAbility === 'No'}
                onChange={() => updateFormData({ videoReportingAbility: 'No' })}
              />
              <span>{currentLang === 'ta' ? 'இல்லை (No)' : 'No'}</span>
            </label>
          </div>
        </div>

        {/* Tamil News Writing Capability (Highlighted for Reporter) */}
        <div className={`form-group ${formData.positionAppliedFor === 'Reporter' ? 'col-span-2' : ''}`}
             style={formData.positionAppliedFor === 'Reporter' ? { background: '#fef2f2', padding: 14, borderRadius: 8, border: '1px solid #fecaca' } : undefined}>
          <label className="form-label">
            <span>
              {t.tamilWritingLabel}
              {formData.positionAppliedFor === 'Reporter' && <span className="required-badge">* (Important for Reporters)</span>}
            </span>
          </label>
          <div className="radio-group" style={{ marginTop: 8 }}>
            <label className="custom-radio">
              <input
                type="radio"
                name="tamilNewsWritingAbility"
                value="Yes"
                checked={formData.tamilNewsWritingAbility === 'Yes'}
                onChange={() => updateFormData({ tamilNewsWritingAbility: 'Yes' })}
              />
              <span>{currentLang === 'ta' ? 'ஆம், தமிழில் பிழையின்றி எழுத முடியும்' : 'Yes, can write Tamil news reports accurately'}</span>
            </label>
            <label className="custom-radio">
              <input
                type="radio"
                name="tamilNewsWritingAbility"
                value="No"
                checked={formData.tamilNewsWritingAbility === 'No'}
                onChange={() => updateFormData({ tamilNewsWritingAbility: 'No' })}
              />
              <span>{currentLang === 'ta' ? 'இல்லை' : 'No'}</span>
            </label>
          </div>
        </div>

        {/* Preferred Joining Date */}
        <div className="form-group col-span-2">
          <label className="form-label" htmlFor="joining-date-input">
            <span>
              <Calendar size={15} style={{ display: 'inline', marginRight: 4 }} />
              {t.preferredJoiningDateLabel}
            </span>
          </label>
          <input
            id="joining-date-input"
            type="date"
            className="form-input"
            value={formData.preferredJoiningDate}
            onChange={(e) => updateFormData({ preferredJoiningDate: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};
