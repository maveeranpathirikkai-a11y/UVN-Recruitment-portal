import React, { useRef } from 'react';
import { ApplicationFormData, Language } from '../../types';
import { TRANSLATIONS } from '../../data/translations';
import { User, Phone, Mail, Home, Hash, Camera, CheckSquare, Square } from 'lucide-react';

interface Step2Props {
  formData: ApplicationFormData;
  updateFormData: (fields: Partial<ApplicationFormData>) => void;
  currentLang: Language;
  errors: Record<string, string>;
}

export const Step2Personal: React.FC<Step2Props> = ({
  formData,
  updateFormData,
  currentLang,
  errors
}) => {
  const t = TRANSLATIONS[currentLang];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
    const updates: Partial<ApplicationFormData> = { mobileNumber: raw };
    if (formData.isWhatsAppSame) {
      updates.whatsAppNumber = raw;
    }
    updateFormData(updates);
  };

  const handleWhatsAppCheckbox = () => {
    const nextSame = !formData.isWhatsAppSame;
    updateFormData({
      isWhatsAppSame: nextSame,
      whatsAppNumber: nextSame ? formData.mobileNumber : ''
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit. Please choose a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      updateFormData({
        photoBase64: event.target?.result as string,
        photoFileName: file.name
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="step-content">
      <div className="section-header">
        <h2 className="section-title">
          <User size={24} />
          {t.step2Title}
        </h2>
        <p className="section-subtitle">{t.step2Sub}</p>
      </div>

      <div className="form-grid">
        {/* Full Name */}
        <div className="form-group col-span-2">
          <label className="form-label" htmlFor="full-name-input">
            <span>
              {t.fullNameLabel}
              <span className="required-badge">*</span>
            </span>
          </label>
          <input
            id="full-name-input"
            type="text"
            className={`form-input ${errors.fullName ? 'input-error' : ''}`}
            placeholder={t.fullNamePlaceholder}
            value={formData.fullName}
            onChange={(e) => updateFormData({ fullName: e.target.value })}
          />
          {errors.fullName && <span className="error-text">{errors.fullName}</span>}
        </div>

        {/* Guardian Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="guardian-name-input">
            <span>{t.guardianNameLabel}</span>
          </label>
          <input
            id="guardian-name-input"
            type="text"
            className="form-input"
            placeholder={t.guardianNamePlaceholder}
            value={formData.guardianName}
            onChange={(e) => updateFormData({ guardianName: e.target.value })}
          />
        </div>

        {/* Date of Birth */}
        <div className="form-group">
          <label className="form-label" htmlFor="dob-input">
            <span>{t.dobLabel}</span>
          </label>
          <input
            id="dob-input"
            type="date"
            className="form-input"
            value={formData.dateOfBirth}
            onChange={(e) => updateFormData({ dateOfBirth: e.target.value })}
          />
        </div>

        {/* Gender */}
        <div className="form-group col-span-2">
          <label className="form-label">
            <span>{t.genderLabel}</span>
          </label>
          <div className="radio-group" style={{ marginTop: 4 }}>
            {[
              { id: 'Male', label: t.genderMale },
              { id: 'Female', label: t.genderFemale },
              { id: 'Other', label: t.genderOther }
            ].map((g) => (
              <label key={g.id} className="custom-radio">
                <input
                  type="radio"
                  name="gender"
                  value={g.id}
                  checked={formData.gender === g.id}
                  onChange={(e) => updateFormData({ gender: e.target.value })}
                />
                <span>{g.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Mobile Number */}
        <div className="form-group">
          <label className="form-label" htmlFor="mobile-input">
            <span>
              <Phone size={15} style={{ display: 'inline', marginRight: 4 }} />
              {t.mobileLabel}
              <span className="required-badge">*</span>
            </span>
          </label>
          <input
            id="mobile-input"
            type="tel"
            maxLength={10}
            className={`form-input ${errors.mobileNumber ? 'input-error' : ''}`}
            placeholder={t.mobilePlaceholder}
            value={formData.mobileNumber}
            onChange={handleMobileChange}
          />
          {errors.mobileNumber && <span className="error-text">{errors.mobileNumber}</span>}
        </div>

        {/* WhatsApp Number */}
        <div className="form-group">
          <label className="form-label" htmlFor="whatsapp-input">
            <span>{t.whatsappLabel}</span>
            <button
              type="button"
              onClick={handleWhatsAppCheckbox}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontSize: '0.8rem',
                color: 'var(--color-primary-red)'
              }}
            >
              {formData.isWhatsAppSame ? <CheckSquare size={16} /> : <Square size={16} />}
              <span>{t.sameAsMobile}</span>
            </button>
          </label>
          <input
            id="whatsapp-input"
            type="tel"
            maxLength={10}
            className="form-input"
            placeholder={t.whatsappPlaceholder}
            value={formData.whatsAppNumber}
            onChange={(e) => updateFormData({ whatsAppNumber: e.target.value.replace(/[^0-9]/g, '').slice(0, 10) })}
            disabled={formData.isWhatsAppSame}
          />
        </div>

        {/* Email */}
        <div className="form-group col-span-2">
          <label className="form-label" htmlFor="email-input">
            <span>
              <Mail size={15} style={{ display: 'inline', marginRight: 4 }} />
              {t.emailLabel}
              <span className="required-badge">*</span>
            </span>
          </label>
          <input
            id="email-input"
            type="email"
            className={`form-input ${errors.email ? 'input-error' : ''}`}
            placeholder={t.emailPlaceholder}
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        {/* Residential Address */}
        <div className="form-group col-span-2">
          <label className="form-label" htmlFor="address-input">
            <span>
              <Home size={15} style={{ display: 'inline', marginRight: 4 }} />
              {t.addressLabel}
              <span className="required-badge">*</span>
            </span>
          </label>
          <textarea
            id="address-input"
            className={`form-textarea ${errors.residentialAddress ? 'input-error' : ''}`}
            placeholder={t.addressPlaceholder}
            value={formData.residentialAddress}
            onChange={(e) => updateFormData({ residentialAddress: e.target.value })}
          />
          {errors.residentialAddress && <span className="error-text">{errors.residentialAddress}</span>}
        </div>

        {/* PIN Code */}
        <div className="form-group">
          <label className="form-label" htmlFor="pincode-input">
            <span>
              <Hash size={15} style={{ display: 'inline', marginRight: 4 }} />
              {t.pinCodeLabel}
              <span className="required-badge">*</span>
            </span>
          </label>
          <input
            id="pincode-input"
            type="text"
            maxLength={6}
            className={`form-input ${errors.pinCode ? 'input-error' : ''}`}
            placeholder={t.pinCodePlaceholder}
            value={formData.pinCode}
            onChange={(e) => updateFormData({ pinCode: e.target.value.replace(/[^0-9]/g, '').slice(0, 6) })}
          />
          {errors.pinCode && <span className="error-text">{errors.pinCode}</span>}
        </div>

        {/* Profile Photo (Optional) */}
        <div className="form-group">
          <label className="form-label">
            <span>
              <Camera size={15} style={{ display: 'inline', marginRight: 4 }} />
              {t.profilePhotoLabel}
            </span>
          </label>
          <div
            className="file-dropzone"
            onClick={() => fileInputRef.current?.click()}
            style={{ padding: '12px' }}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/png,image/webp"
              style={{ display: 'none' }}
              onChange={handlePhotoUpload}
            />
            {formData.photoBase64 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
                <img
                  src={formData.photoBase64}
                  alt="Profile Preview"
                  style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }}
                />
                <span className="file-name-pill">{formData.photoFileName || 'Photo Selected'}</span>
              </div>
            ) : (
              <div className="file-dropzone-inner">
                <Camera size={24} color="var(--color-primary-red)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Click to select photo</span>
                <span className="help-text">{t.profilePhotoHint}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
