import React from 'react';
import { ApplicationFormData, Language } from '../../types';
import { TRANSLATIONS } from '../../data/translations';
import { LOCATION_MASTER_DATA, getDistrictsForState, getTaluksForDistrict } from '../../data/locations';
import { MapPin, Building, Navigation } from 'lucide-react';

interface Step1Props {
  formData: ApplicationFormData;
  updateFormData: (fields: Partial<ApplicationFormData>) => void;
  currentLang: Language;
  errors: Record<string, string>;
}

export const Step1Location: React.FC<Step1Props> = ({
  formData,
  updateFormData,
  currentLang,
  errors
}) => {
  const t = TRANSLATIONS[currentLang];

  // Available districts based on selected state
  const availableDistricts = formData.state ? getDistrictsForState(formData.state) : [];

  // Available taluks based on selected state & district
  const availableTaluks = (formData.state && formData.district) 
    ? getTaluksForDistrict(formData.state, formData.district) 
    : [];

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    updateFormData({
      state: newState,
      district: '', // Reset dependent district
      taluk: ''     // Reset dependent taluk
    });
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDistrict = e.target.value;
    updateFormData({
      district: newDistrict,
      taluk: '' // Reset dependent taluk
    });
  };

  return (
    <div className="step-content">
      <div className="section-header">
        <h2 className="section-title">
          <MapPin size={24} />
          {t.step1Title}
        </h2>
        <p className="section-subtitle">{t.step1Sub}</p>
      </div>

      <div className="form-grid">
        {/* State Selection */}
        <div className="form-group col-span-2">
          <label className="form-label" htmlFor="state-select">
            <span>
              {t.stateLabel}
              <span className="required-badge">*</span>
            </span>
            <span className="help-text">Tamil Nadu / Puducherry</span>
          </label>
          <select
            id="state-select"
            className={`form-select ${errors.state ? 'input-error' : ''}`}
            value={formData.state}
            onChange={handleStateChange}
          >
            <option value="">-- {t.stateSelect} --</option>
            {LOCATION_MASTER_DATA.map((state) => (
              <option key={state.id} value={state.nameEn}>
                {currentLang === 'ta' ? `${state.nameTa} (${state.nameEn})` : state.nameEn}
              </option>
            ))}
          </select>
          {errors.state && <span className="error-text">{errors.state}</span>}
        </div>

        {/* District Selection */}
        <div className="form-group">
          <label className="form-label" htmlFor="district-select">
            <span>
              <Building size={16} style={{ display: 'inline', marginRight: 4 }} />
              {t.districtLabel}
              <span className="required-badge">*</span>
            </span>
          </label>
          <select
            id="district-select"
            className={`form-select ${errors.district ? 'input-error' : ''}`}
            value={formData.district}
            onChange={handleDistrictChange}
            disabled={!formData.state}
          >
            <option value="">
              {!formData.state ? `-- ${t.stateSelect} first --` : `-- ${t.districtSelect} --`}
            </option>
            {availableDistricts.map((dist) => (
              <option key={dist.id} value={dist.nameEn}>
                {currentLang === 'ta' ? `${dist.nameTa} (${dist.nameEn})` : `${dist.nameEn} - ${dist.nameTa}`}
              </option>
            ))}
          </select>
          {errors.district && <span className="error-text">{errors.district}</span>}
        </div>

        {/* Taluk Selection */}
        <div className="form-group">
          <label className="form-label" htmlFor="taluk-select">
            <span>
              <Navigation size={16} style={{ display: 'inline', marginRight: 4 }} />
              {t.talukLabel}
              <span className="required-badge">*</span>
            </span>
          </label>
          <select
            id="taluk-select"
            className={`form-select ${errors.taluk ? 'input-error' : ''}`}
            value={formData.taluk}
            onChange={(e) => updateFormData({ taluk: e.target.value })}
            disabled={!formData.district}
          >
            <option value="">
              {!formData.district ? `-- ${t.districtSelect} first --` : `-- ${t.talukSelect} --`}
            </option>
            {availableTaluks.map((taluk, idx) => (
              <option key={idx} value={taluk.nameEn}>
                {currentLang === 'ta' ? `${taluk.nameTa} (${taluk.nameEn})` : `${taluk.nameEn} - ${taluk.nameTa}`}
              </option>
            ))}
          </select>
          {errors.taluk && <span className="error-text">{errors.taluk}</span>}
        </div>

        {/* Village / Town (Optional) */}
        <div className="form-group col-span-2">
          <label className="form-label" htmlFor="village-town-input">
            <span>{t.villageTownLabel}</span>
          </label>
          <input
            id="village-town-input"
            type="text"
            className="form-input"
            placeholder={t.villageTownPlaceholder}
            value={formData.villageTown}
            onChange={(e) => updateFormData({ villageTown: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};
