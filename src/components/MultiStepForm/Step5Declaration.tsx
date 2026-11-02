import React, { useRef } from 'react';
import { ApplicationFormData, Language } from '../../types';
import { TRANSLATIONS } from '../../data/translations';
import { ShieldCheck, Upload, FileText, CheckSquare, Square, Info, ExternalLink } from 'lucide-react';

interface Step5Props {
  formData: ApplicationFormData;
  updateFormData: (fields: Partial<ApplicationFormData>) => void;
  currentLang: Language;
  errors: Record<string, string>;
  onOpenPrivacyModal: () => void;
}

export const Step5Declaration: React.FC<Step5Props> = ({
  formData,
  updateFormData,
  currentLang,
  errors,
  onOpenPrivacyModal
}) => {
  const t = TRANSLATIONS[currentLang];

  const resumeInputRef = useRef<HTMLInputElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);
  const workSampleInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldBase64: 'resumeBase64' | 'certificateBase64' | 'workSampleBase64',
    fieldName: 'resumeFileName' | 'certificateFileName' | 'workSampleFileName'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds the 5MB limit. Please upload a smaller document.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      updateFormData({
        [fieldBase64]: event.target?.result as string,
        [fieldName]: file.name
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="step-content">
      <div className="section-header">
        <h2 className="section-title">
          <ShieldCheck size={24} />
          {t.step5Title}
        </h2>
        <p className="section-subtitle">{t.step5Sub}</p>
      </div>

      {/* Optional Document Uploads */}
      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: 12 }}>
        {t.documentsTitle}
      </h3>

      <div className="form-grid" style={{ marginBottom: 24 }}>
        {/* Resume Upload */}
        <div className="form-group">
          <label className="form-label">{t.resumeUploadLabel}</label>
          <div
            className="file-dropzone"
            onClick={() => resumeInputRef.current?.click()}
          >
            <input
              type="file"
              ref={resumeInputRef}
              accept=".pdf,.doc,.docx"
              style={{ display: 'none' }}
              onChange={(e) => handleFileUpload(e, 'resumeBase64', 'resumeFileName')}
            />
            {formData.resumeFileName ? (
              <span className="file-name-pill">
                <FileText size={16} />
                {formData.resumeFileName}
              </span>
            ) : (
              <div className="file-dropzone-inner">
                <Upload size={20} color="var(--color-primary-red)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Click to upload Resume (PDF)</span>
                <span className="help-text">Max 5MB</span>
              </div>
            )}
          </div>
        </div>

        {/* Certificate Upload */}
        <div className="form-group">
          <label className="form-label">{t.certUploadLabel}</label>
          <div
            className="file-dropzone"
            onClick={() => certInputRef.current?.click()}
          >
            <input
              type="file"
              ref={certInputRef}
              accept=".pdf,.jpg,.jpeg,.png"
              style={{ display: 'none' }}
              onChange={(e) => handleFileUpload(e, 'certificateBase64', 'certificateFileName')}
            />
            {formData.certificateFileName ? (
              <span className="file-name-pill">
                <FileText size={16} />
                {formData.certificateFileName}
              </span>
            ) : (
              <div className="file-dropzone-inner">
                <Upload size={20} color="var(--color-gold)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Click to upload Certificate</span>
                <span className="help-text">Degree / Diploma (PDF/Image)</span>
              </div>
            )}
          </div>
        </div>

        {/* Work Sample Upload */}
        <div className="form-group col-span-2">
          <label className="form-label">{t.workSamplesLabel}</label>
          <div
            className="file-dropzone"
            onClick={() => workSampleInputRef.current?.click()}
          >
            <input
              type="file"
              ref={workSampleInputRef}
              accept=".pdf,.jpg,.jpeg,.png,.zip"
              style={{ display: 'none' }}
              onChange={(e) => handleFileUpload(e, 'workSampleBase64', 'workSampleFileName')}
            />
            {formData.workSampleFileName ? (
              <span className="file-name-pill">
                <FileText size={16} />
                {formData.workSampleFileName}
              </span>
            ) : (
              <div className="file-dropzone-inner">
                <Upload size={20} color="var(--color-primary-red)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Click to upload Work Samples</span>
                <span className="help-text">Articles, Photos, Reports (PDF, Images, ZIP)</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Strict Privacy Notice & Optional ID Reference */}
      <div className="privacy-alert">
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <Info size={22} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <strong>{t.identityTitle}: </strong>
            {t.privacyAadhaarNotice}
          </div>
        </div>
      </div>

      <div className="form-group col-span-2" style={{ marginBottom: 28 }}>
        <label className="form-label" htmlFor="id-ref-input">
          <span>{t.idReferenceLabel}</span>
          <span className="help-text">Optional / விருப்பத்தேர்வு</span>
        </label>
        <input
          id="id-ref-input"
          type="text"
          maxLength={20}
          className="form-input"
          placeholder={t.idReferencePlaceholder}
          value={formData.identityReference}
          onChange={(e) => updateFormData({ identityReference: e.target.value })}
        />
      </div>

      {/* Mandatory Declaration Checkboxes */}
      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: 14 }}>
        {t.consentTitle}
        <span className="required-badge">*</span>
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
        {/* Consent 1 */}
        <div
          onClick={() => updateFormData({ consentAccurate: !formData.consentAccurate })}
          style={{
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start',
            cursor: 'pointer',
            padding: '12px 14px',
            borderRadius: 8,
            background: formData.consentAccurate ? '#f0fdf4' : '#fafafa',
            border: `1px solid ${formData.consentAccurate ? '#86efac' : '#e2e8f0'}`
          }}
        >
          <div style={{ marginTop: 2, flexShrink: 0 }}>
            {formData.consentAccurate ? (
              <CheckSquare size={20} color="#16a34a" />
            ) : (
              <Square size={20} color="#94a3b8" />
            )}
          </div>
          <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-ink)' }}>
            {t.consent1Text}
          </span>
        </div>

        {/* Consent 2 */}
        <div
          onClick={() => updateFormData({ consentRecruitment: !formData.consentRecruitment })}
          style={{
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start',
            cursor: 'pointer',
            padding: '12px 14px',
            borderRadius: 8,
            background: formData.consentRecruitment ? '#f0fdf4' : '#fafafa',
            border: `1px solid ${formData.consentRecruitment ? '#86efac' : '#e2e8f0'}`
          }}
        >
          <div style={{ marginTop: 2, flexShrink: 0 }}>
            {formData.consentRecruitment ? (
              <CheckSquare size={20} color="#16a34a" />
            ) : (
              <Square size={20} color="#94a3b8" />
            )}
          </div>
          <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-ink)' }}>
            {t.consent2Text}
          </span>
        </div>

        {/* Consent 3 */}
        <div
          onClick={() => updateFormData({ consentContact: !formData.consentContact })}
          style={{
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start',
            cursor: 'pointer',
            padding: '12px 14px',
            borderRadius: 8,
            background: formData.consentContact ? '#f0fdf4' : '#fafafa',
            border: `1px solid ${formData.consentContact ? '#86efac' : '#e2e8f0'}`
          }}
        >
          <div style={{ marginTop: 2, flexShrink: 0 }}>
            {formData.consentContact ? (
              <CheckSquare size={20} color="#16a34a" />
            ) : (
              <Square size={20} color="#94a3b8" />
            )}
          </div>
          <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-ink)' }}>
            {t.consent3Text}
          </span>
        </div>
      </div>

      {errors.consents && (
        <div style={{ color: 'var(--color-danger)', fontSize: '0.85rem', fontWeight: 600, marginBottom: 14 }}>
          {errors.consents}
        </div>
      )}

      {/* Link to Privacy Policy */}
      <div style={{ textAlign: 'center', marginTop: 12 }}>
        <button
          type="button"
          onClick={onOpenPrivacyModal}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-primary-red)',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.875rem',
            textDecoration: 'underline'
          }}
        >
          <ExternalLink size={15} />
          {t.termsAndPrivacyLink}
        </button>
      </div>
    </div>
  );
};
