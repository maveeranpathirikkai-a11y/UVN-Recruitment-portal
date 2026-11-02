import React from 'react';
import { ApplicationFormData, Language } from '../../types';
import { TRANSLATIONS } from '../../data/translations';
import { GraduationCap, Award, Link, History, HeartHandshake, CheckSquare, Square } from 'lucide-react';

interface Step4Props {
  formData: ApplicationFormData;
  updateFormData: (fields: Partial<ApplicationFormData>) => void;
  currentLang: Language;
  errors: Record<string, string>;
}

export const Step4Education: React.FC<Step4Props> = ({
  formData,
  updateFormData,
  currentLang,
  errors
}) => {
  const t = TRANSLATIONS[currentLang];

  const handleLanguageToggle = (lang: string) => {
    const current = formData.languagesKnown || [];
    let updated: string[];
    if (current.includes(lang)) {
      updated = current.filter(l => l !== lang);
    } else {
      updated = [...current, lang];
    }
    updateFormData({ languagesKnown: updated });
  };

  const handleExperienceToggle = (hasExp: 'Yes' | 'No') => {
    if (hasExp === 'No') {
      updateFormData({
        journalismExperience: 'No',
        experienceYears: '0',
        previousOrganisation: '',
        previousDesignation: '',
        previousWorkDetails: ''
      });
    } else {
      updateFormData({
        journalismExperience: 'Yes',
        experienceYears: formData.experienceYears === '0' ? '1' : formData.experienceYears
      });
    }
  };

  return (
    <div className="step-content">
      <div className="section-header">
        <h2 className="section-title">
          <GraduationCap size={24} />
          {t.step4Title}
        </h2>
        <p className="section-subtitle">{t.step4Sub}</p>
      </div>

      <div className="form-grid">
        {/* Highest Qualification */}
        <div className="form-group col-span-2">
          <label className="form-label" htmlFor="qualification-select">
            <span>
              {t.eduQualificationLabel}
              <span className="required-badge">*</span>
            </span>
          </label>
          <select
            id="qualification-select"
            className={`form-select ${errors.educationalQualification ? 'input-error' : ''}`}
            value={formData.educationalQualification}
            onChange={(e) => updateFormData({ educationalQualification: e.target.value })}
          >
            <option value="">-- Select Highest Qualification --</option>
            <option value="10th Standard">{t.edu10th}</option>
            <option value="12th Standard">{t.edu12th}</option>
            <option value="Diploma">{t.eduDiploma}</option>
            <option value="Undergraduate Degree">{t.eduUG}</option>
            <option value="Postgraduate Degree">{t.eduPG}</option>
            <option value="Other">{t.eduOther}</option>
          </select>
          {errors.educationalQualification && (
            <span className="error-text">{errors.educationalQualification}</span>
          )}
        </div>

        {/* Course / Degree Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="course-name-input">
            <span>{t.courseNameLabel}</span>
          </label>
          <input
            id="course-name-input"
            type="text"
            className="form-input"
            placeholder={t.courseNamePlaceholder}
            value={formData.courseName}
            onChange={(e) => updateFormData({ courseName: e.target.value })}
          />
        </div>

        {/* College / Institution Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="institution-input">
            <span>{t.institutionLabel}</span>
          </label>
          <input
            id="institution-input"
            type="text"
            className="form-input"
            placeholder={t.institutionPlaceholder}
            value={formData.institutionName}
            onChange={(e) => updateFormData({ institutionName: e.target.value })}
          />
        </div>

        {/* Languages Known */}
        <div className="form-group col-span-2">
          <label className="form-label">
            <span>{t.languagesLabel}</span>
          </label>
          <div className="checkbox-group" style={{ marginTop: 4 }}>
            {[
              { id: 'Tamil', label: t.langTamil },
              { id: 'English', label: t.langEnglish },
              { id: 'Telugu', label: 'தெலுங்கு / Telugu' },
              { id: 'Malayalam', label: 'மலையாளம் / Malayalam' },
              { id: 'Hindi', label: 'இந்தி / Hindi' }
            ].map((lang) => {
              const isChecked = formData.languagesKnown?.includes(lang.id);
              return (
                <div
                  key={lang.id}
                  onClick={() => handleLanguageToggle(lang.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    cursor: 'pointer',
                    userSelect: 'none',
                    padding: '6px 12px',
                    borderRadius: 6,
                    background: isChecked ? '#fef2f2' : '#f8fafc',
                    border: `1px solid ${isChecked ? '#fca5a5' : '#e2e8f0'}`
                  }}
                >
                  {isChecked ? (
                    <CheckSquare size={16} color="var(--color-primary-red)" />
                  ) : (
                    <Square size={16} color="#94a3b8" />
                  )}
                  <span style={{ fontSize: '0.875rem', fontWeight: isChecked ? 600 : 500 }}>
                    {lang.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Journalism Experience Toggle */}
        <div className="form-group col-span-2" style={{ background: '#f8fafc', padding: 18, borderRadius: 10, border: '1px solid var(--color-border)' }}>
          <label className="form-label">
            <span>
              <History size={16} style={{ display: 'inline', marginRight: 4 }} />
              {t.journalismExpLabel}
              <span className="required-badge">*</span>
            </span>
          </label>
          <div className="radio-group" style={{ marginTop: 8 }}>
            <label className="custom-radio">
              <input
                type="radio"
                name="journalismExperience"
                value="Yes"
                checked={formData.journalismExperience === 'Yes'}
                onChange={() => handleExperienceToggle('Yes')}
              />
              <span style={{ fontWeight: 600 }}>{currentLang === 'ta' ? 'ஆம், முன் அனுபவம் உண்டு (Experienced)' : 'Yes, I have experience'}</span>
            </label>
            <label className="custom-radio">
              <input
                type="radio"
                name="journalismExperience"
                value="No"
                checked={formData.journalismExperience === 'No'}
                onChange={() => handleExperienceToggle('No')}
              />
              <span style={{ fontWeight: 600 }}>{currentLang === 'ta' ? 'இல்லை, புதியவர் (Fresher)' : 'No, I am a Fresher'}</span>
            </label>
          </div>
        </div>

        {/* Conditional Experience Fields (Shown only if Experience = Yes) */}
        {formData.journalismExperience === 'Yes' && (
          <>
            <div className="form-group">
              <label className="form-label" htmlFor="exp-years-input">
                <span>
                  {t.expYearsLabel}
                  <span className="required-badge">*</span>
                </span>
              </label>
              <input
                id="exp-years-input"
                type="number"
                min="1"
                max="50"
                className={`form-input ${errors.experienceYears ? 'input-error' : ''}`}
                placeholder={t.expYearsPlaceholder}
                value={formData.experienceYears}
                onChange={(e) => updateFormData({ experienceYears: e.target.value })}
              />
              {errors.experienceYears && <span className="error-text">{errors.experienceYears}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="prev-org-input">
                <span>{t.prevOrgLabel}</span>
              </label>
              <input
                id="prev-org-input"
                type="text"
                className="form-input"
                placeholder={t.prevOrgPlaceholder}
                value={formData.previousOrganisation}
                onChange={(e) => updateFormData({ previousOrganisation: e.target.value })}
              />
            </div>

            <div className="form-group col-span-2">
              <label className="form-label" htmlFor="prev-designation-input">
                <span>{t.prevDesignationLabel}</span>
              </label>
              <input
                id="prev-designation-input"
                type="text"
                className="form-input"
                placeholder={t.prevDesignationPlaceholder}
                value={formData.previousDesignation}
                onChange={(e) => updateFormData({ previousDesignation: e.target.value })}
              />
            </div>

            <div className="form-group col-span-2">
              <label className="form-label" htmlFor="prev-work-input">
                <span>{t.prevWorkLabel}</span>
              </label>
              <textarea
                id="prev-work-input"
                className="form-textarea"
                placeholder={t.prevWorkPlaceholder}
                value={formData.previousWorkDetails}
                onChange={(e) => updateFormData({ previousWorkDetails: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="portfolio-url-input">
                <span>
                  <Link size={15} style={{ display: 'inline', marginRight: 4 }} />
                  {t.portfolioUrlLabel}
                </span>
              </label>
              <input
                id="portfolio-url-input"
                type="url"
                className="form-input"
                placeholder={t.portfolioUrlPlaceholder}
                value={formData.portfolioUrl}
                onChange={(e) => updateFormData({ portfolioUrl: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="youtube-url-input">
                <span>
                  <Link size={15} style={{ display: 'inline', marginRight: 4 }} />
                  {t.youtubeUrlLabel}
                </span>
              </label>
              <input
                id="youtube-url-input"
                type="url"
                className="form-input"
                placeholder={t.youtubeUrlPlaceholder}
                value={formData.youtubeUrl}
                onChange={(e) => updateFormData({ youtubeUrl: e.target.value })}
              />
            </div>
          </>
        )}

        {/* Why Join UNGAL VIJAY NAALITHAZH */}
        <div className="form-group col-span-2">
          <label className="form-label" htmlFor="motivation-input">
            <span>
              <HeartHandshake size={15} style={{ display: 'inline', marginRight: 4 }} />
              {t.whyJoinLabel}
            </span>
          </label>
          <textarea
            id="motivation-input"
            className="form-textarea"
            placeholder={t.whyJoinPlaceholder}
            value={formData.motivation}
            onChange={(e) => updateFormData({ motivation: e.target.value })}
          />
        </div>

        {/* Relevant Skills */}
        <div className="form-group">
          <label className="form-label" htmlFor="skills-input">
            <span>
              <Award size={15} style={{ display: 'inline', marginRight: 4 }} />
              {t.relevantSkillsLabel}
            </span>
          </label>
          <input
            id="skills-input"
            type="text"
            className="form-input"
            placeholder={t.relevantSkillsPlaceholder}
            value={formData.relevantSkills}
            onChange={(e) => updateFormData({ relevantSkills: e.target.value })}
          />
        </div>

        {/* References */}
        <div className="form-group">
          <label className="form-label" htmlFor="references-input">
            <span>{t.referencesLabel}</span>
          </label>
          <input
            id="references-input"
            type="text"
            className="form-input"
            placeholder={t.referencesPlaceholder}
            value={formData.references}
            onChange={(e) => updateFormData({ references: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};
