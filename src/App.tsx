import React, { useState } from 'react';
import { ApplicationFormData, Language, AdminUser } from './types';
import { TRANSLATIONS } from './data/translations';
import { ApiService } from './services/api';
import { AuthService } from './services/auth';
import { Header } from './components/Header';
import { StepIndicator } from './components/MultiStepForm/StepIndicator';
import { Step1Location } from './components/MultiStepForm/Step1Location';
import { Step2Personal } from './components/MultiStepForm/Step2Personal';
import { Step3Position } from './components/MultiStepForm/Step3Position';
import { Step4Education } from './components/MultiStepForm/Step4Education';
import { Step5Declaration } from './components/MultiStepForm/Step5Declaration';
import { Step6Review } from './components/MultiStepForm/Step6Review';
import { SubmissionSuccess } from './components/SubmissionSuccess';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { AdminLogin } from './components/Admin/AdminLogin';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

const INITIAL_FORM_DATA: ApplicationFormData = {
  state: '',
  district: '',
  taluk: '',
  villageTown: '',
  fullName: '',
  guardianName: '',
  dateOfBirth: '',
  gender: '',
  mobileNumber: '',
  whatsAppNumber: '',
  isWhatsAppSame: false,
  email: '',
  residentialAddress: '',
  pinCode: '',
  photoBase64: '',
  photoFileName: '',
  positionAppliedFor: 'Reporter',
  preferredReportingArea: '',
  preferredDistrictTaluk: '',
  workType: 'Full-time',
  travelAvailability: 'Yes',
  drivingLicence: 'Yes',
  cameraAvailability: 'Yes',
  smartphoneAvailability: 'Yes',
  videoReportingAbility: 'Yes',
  tamilNewsWritingAbility: 'Yes',
  preferredJoiningDate: '',
  educationalQualification: '',
  courseName: '',
  institutionName: '',
  languagesKnown: ['Tamil', 'English'],
  journalismExperience: 'No',
  experienceYears: '0',
  previousOrganisation: '',
  previousDesignation: '',
  previousWorkDetails: '',
  portfolioUrl: '',
  youtubeUrl: '',
  motivation: '',
  relevantSkills: '',
  references: '',
  resumeBase64: '',
  resumeFileName: '',
  certificateBase64: '',
  certificateFileName: '',
  workSampleBase64: '',
  workSampleFileName: '',
  identityReference: '',
  consentAccurate: false,
  consentRecruitment: false,
  consentContact: false
};

export const App: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<Language>('ta');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<ApplicationFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);

  // Modals & Admin View State
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [showAdminView, setShowAdminView] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(AuthService.getCurrentUser());

  const t = TRANSLATIONS[currentLang];

  const updateFormData = (fields: Partial<ApplicationFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
    // Clear error for edited field
    const fieldKeys = Object.keys(fields);
    if (fieldKeys.length > 0) {
      setErrors((prev) => {
        const copy = { ...prev };
        fieldKeys.forEach((k) => delete copy[k]);
        return copy;
      });
    }
  };

  // Step Validation Logic
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.state) newErrors.state = t.reqField;
      if (!formData.district) newErrors.district = t.reqField;
      if (!formData.taluk) newErrors.taluk = t.reqField;
    } else if (step === 2) {
      if (!formData.fullName.trim()) newErrors.fullName = t.reqField;
      
      const cleanMobile = formData.mobileNumber.replace(/[^0-9]/g, '');
      if (!cleanMobile || cleanMobile.length !== 10) {
        newErrors.mobileNumber = t.invalidMobile;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
        newErrors.email = t.invalidEmail;
      }

      if (!formData.residentialAddress.trim()) newErrors.residentialAddress = t.reqField;

      const cleanPin = formData.pinCode.replace(/[^0-9]/g, '');
      if (!cleanPin || cleanPin.length !== 6) {
        newErrors.pinCode = t.invalidPin;
      }
    } else if (step === 3) {
      if (!formData.positionAppliedFor) newErrors.positionAppliedFor = t.reqField;
    } else if (step === 4) {
      if (!formData.educationalQualification) newErrors.educationalQualification = t.reqField;
      if (formData.journalismExperience === 'Yes') {
        const yrs = parseInt(formData.experienceYears, 10);
        if (!formData.experienceYears || isNaN(yrs) || yrs <= 0) {
          newErrors.experienceYears = t.reqField;
        }
      }
    } else if (step === 5) {
      if (!formData.consentAccurate || !formData.consentRecruitment || !formData.consentContact) {
        newErrors.consents = t.consentRequired;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setCurrentStep((prev) => Math.min(prev + 1, 6));
    }
  };

  const handlePrevStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleEditFromReview = (stepNumber: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep(stepNumber);
  };

  const handleFinalSubmit = async () => {
    setSubmissionError(null);
    setIsSubmitting(true);

    try {
      const response = await ApiService.submitApplication(formData);
      setIsSubmitting(false);

      if (response.success && response.applicationId) {
        setSubmittedAppId(response.applicationId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (response.isDuplicate) {
        setSubmissionError(
          `${t.duplicateError} (Reference: ${response.applicationId || 'Recorded'})`
        );
      } else {
        setSubmissionError(response.message || 'Submission failed. Please check inputs and try again.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setSubmissionError(`Submission error: ${err.message || 'Unknown network error'}`);
    }
  };

  const handleResetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setSubmissionError(null);
    setSubmittedAppId(null);
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdmin = () => {
    if (AuthService.isAuthenticated()) {
      setShowAdminView(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminLoginSuccess = (user: AdminUser) => {
    setAdminUser(user);
    setShowAdminView(true);
  };

  const handleAdminLogout = () => {
    AuthService.logout();
    setAdminUser(null);
    setShowAdminView(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Newspaper Site Header */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        onOpenAdmin={handleOpenAdmin}
        isAdminLoggedIn={!!adminUser}
        onBackToPortal={() => setShowAdminView(false)}
        showAdminView={showAdminView}
      />

      {showAdminView && adminUser ? (
        /* Admin Dashboard View */
        <main style={{ flex: 1 }}>
          <AdminDashboard
            currentLang={currentLang}
            onLogout={handleAdminLogout}
            currentUser={adminUser}
          />
        </main>
      ) : (
        /* Public Recruitment Portal View */
        <main style={{ flex: 1 }}>
          {/* Hero Banner */}
          {!submittedAppId && (
            <section className="hero-banner">
              <div className="hero-badge">
                <Sparkles size={14} />
                <span>
                  {currentLang === 'ta' ? 'அதிகாரப்பூர்வ ஆட்சேர்ப்பு அறிவிப்பு 2026' : 'Official Recruitment Notification 2026'}
                </span>
              </div>
              <h1 className="hero-heading">{t.bannerHeading}</h1>
              <p className="hero-subtext">{t.bannerSubtext}</p>
            </section>
          )}

          <div className="portal-main">
            <div className="form-card">
              {submittedAppId ? (
                /* Success Screen with Application ID */
                <SubmissionSuccess
                  applicationId={submittedAppId}
                  formData={formData}
                  currentLang={currentLang}
                  onReset={handleResetForm}
                />
              ) : (
                /* Multi-step Application Flow */
                <>
                  <StepIndicator
                    currentStep={currentStep}
                    totalSteps={6}
                    currentLang={currentLang}
                    onStepClick={(step) => {
                      if (step < currentStep) setCurrentStep(step);
                    }}
                  />

                  {/* Step Components */}
                  {currentStep === 1 && (
                    <Step1Location
                      formData={formData}
                      updateFormData={updateFormData}
                      currentLang={currentLang}
                      errors={errors}
                    />
                  )}

                  {currentStep === 2 && (
                    <Step2Personal
                      formData={formData}
                      updateFormData={updateFormData}
                      currentLang={currentLang}
                      errors={errors}
                    />
                  )}

                  {currentStep === 3 && (
                    <Step3Position
                      formData={formData}
                      updateFormData={updateFormData}
                      currentLang={currentLang}
                      errors={errors}
                    />
                  )}

                  {currentStep === 4 && (
                    <Step4Education
                      formData={formData}
                      updateFormData={updateFormData}
                      currentLang={currentLang}
                      errors={errors}
                    />
                  )}

                  {currentStep === 5 && (
                    <Step5Declaration
                      formData={formData}
                      updateFormData={updateFormData}
                      currentLang={currentLang}
                      errors={errors}
                      onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
                    />
                  )}

                  {currentStep === 6 && (
                    <Step6Review
                      formData={formData}
                      onEditStep={handleEditFromReview}
                      onSubmit={handleFinalSubmit}
                      isSubmitting={isSubmitting}
                      submissionError={submissionError}
                      currentLang={currentLang}
                    />
                  )}

                  {/* Navigation Buttons */}
                  {currentStep < 6 && (
                    <div className="form-footer">
                      {currentStep > 1 ? (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={handlePrevStep}
                        >
                          <ArrowLeft size={16} />
                          <span>{t.btnBack}</span>
                        </button>
                      ) : (
                        <div />
                      )}

                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleNextStep}
                      >
                        <span>{t.btnNext}</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer style={{
        background: '#0f172a',
        color: '#94a3b8',
        padding: '24px 20px',
        textAlign: 'center',
        fontSize: '0.825rem',
        borderTop: '3px solid var(--color-primary-red)',
        marginTop: 'auto'
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem' }}>
            UNGAL VIJAY NAALITHAZH (உங்கள் விஜய் நாளிதழ்) — Tamil Daily
          </div>
          <div>PRGI.NO: TNTAM/26/A6857 | தமிழ்நாடு மற்றும் புதுச்சேரி பதிப்புகள்</div>
          <div style={{ marginTop: 4 }}>
            <span>© {new Date().getFullYear()} UNGAL VIJAY NAALITHAZH. All rights reserved.</span>
            {' | '}
            <button
              type="button"
              onClick={() => setIsPrivacyModalOpen(true)}
              style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Privacy Policy & Terms
            </button>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        currentLang={currentLang}
      />

      {/* Admin Login Modal */}
      <AdminLogin
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
        currentLang={currentLang}
      />
    </div>
  );
};

export default App;
