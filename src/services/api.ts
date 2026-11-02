import { ApplicationFormData, ApplicationRecord, ApplicationStatus } from '../types';

const STORAGE_KEY = 'uvn_recruitment_applications_v1';
const GAS_URL_KEY = 'uvn_google_apps_script_url';

// Default initial seeded applications for realistic dashboard experience
const INITIAL_APPLICATIONS: ApplicationRecord[] = [
  {
    id: 'app-1',
    applicationId: 'UVN-2026-000001',
    applicationStatus: 'Shortlisted',
    timestamp: '2026-11-01T09:30:00.000Z',
    lastUpdated: '2026-11-02T11:15:00.000Z',
    recruitmentNotes: 'Strong investigative reporting background in Madurai rural issues. Shortlisted for in-person interview.',
    state: 'Tamil Nadu',
    district: 'Madurai',
    taluk: 'Madurai North',
    villageTown: 'K.Pudur',
    fullName: 'செந்தில்குமார் சுப்பிரமணியன் (Senthilkumar S)',
    guardianName: 'சுப்பிரமணியன்',
    dateOfBirth: '1995-04-12',
    gender: 'Male',
    mobileNumber: '9842145678',
    whatsAppNumber: '9842145678',
    isWhatsAppSame: true,
    email: 'senthil.reporter@gmail.com',
    residentialAddress: '14, காந்தி வீதி, கே.புதூர், மதுரை - 625007',
    pinCode: '625007',
    positionAppliedFor: 'Reporter',
    preferredReportingArea: 'அரசியல் மற்றும் உழவர் நலன் (Politics & Agriculture)',
    preferredDistrictTaluk: 'Madurai - Madurai North / Melur',
    workType: 'Full-time',
    travelAvailability: 'Yes',
    drivingLicence: 'Yes',
    cameraAvailability: 'Yes',
    smartphoneAvailability: 'Yes',
    videoReportingAbility: 'Yes',
    tamilNewsWritingAbility: 'Yes',
    preferredJoiningDate: '2026-12-01',
    educationalQualification: 'Postgraduate Degree',
    courseName: 'MA Journalism & Mass Communication',
    institutionName: 'Madurai Kamaraj University',
    languagesKnown: ['Tamil', 'English'],
    journalismExperience: 'Yes',
    experienceYears: '4',
    previousOrganisation: 'தினமலர் நாளிதழ் (Dinamalar)',
    previousDesignation: 'மாவட்ட செய்தியாளர் (District Reporter)',
    previousWorkDetails: 'கள ஆய்வு அறிக்கைகள் மற்றும் தாலுகா அளவிலான செய்தி சேகரிப்பு.',
    portfolioUrl: 'https://example.com/senthil-articles',
    youtubeUrl: '',
    motivation: 'உங்கள் விஜய் நாளிதழின் கொள்கைகளுடன் இணைந்து உண்மைச் செய்திகளை மக்களிடம் கொண்டு செல்ல விரும்புகிறேன்.',
    relevantSkills: 'Fast Tamil typing, investigative news writing, ground reporting',
    references: 'கே. பெரியசாமி - மூத்த செய்தியாளர், 9443123456',
    identityReference: '8745',
    consentAccurate: true,
    consentRecruitment: true,
    consentContact: true
  },
  {
    id: 'app-2',
    applicationId: 'UVN-2026-000002',
    applicationStatus: 'New',
    timestamp: '2026-11-02T14:20:00.000Z',
    lastUpdated: '2026-11-02T14:20:00.000Z',
    recruitmentNotes: '',
    state: 'Tamil Nadu',
    district: 'Chennai',
    taluk: 'Mylapore',
    villageTown: 'Alwarpet',
    fullName: 'கார்த்திக் ஆனந்த் (Karthik Anand)',
    guardianName: 'ஆனந்த் பாபு',
    dateOfBirth: '1998-08-22',
    gender: 'Male',
    mobileNumber: '9789012345',
    whatsAppNumber: '9789012345',
    isWhatsAppSame: true,
    email: 'karthik.pressphoto@gmail.com',
    residentialAddress: '28, சி.பி. ராமசாமி சாலை, ஆழ்வார்பேட்டை, சென்னை - 600018',
    pinCode: '600018',
    positionAppliedFor: 'Photojournalist',
    preferredReportingArea: 'சமூக நிகழ்வுகள் மற்றும் விளையாட்டு (Culture & Sports)',
    preferredDistrictTaluk: 'Chennai - Mylapore / Egmore',
    workType: 'Full-time',
    travelAvailability: 'Yes',
    drivingLicence: 'Yes',
    cameraAvailability: 'Yes',
    smartphoneAvailability: 'Yes',
    videoReportingAbility: 'Yes',
    tamilNewsWritingAbility: 'Yes',
    preferredJoiningDate: '2026-11-15',
    educationalQualification: 'Undergraduate Degree',
    courseName: 'B.Sc Visual Communication',
    institutionName: 'Loyola College, Chennai',
    languagesKnown: ['Tamil', 'English'],
    journalismExperience: 'Yes',
    experienceYears: '3',
    previousOrganisation: 'தி இந்து தமிழ் திசை (The Hindu Tamil Thisai)',
    previousDesignation: 'புகைப்படக் கலைஞர் (Staff Photographer)',
    previousWorkDetails: 'விளையாட்டு மற்றும் கலாச்சார நிகழ்வுகளின் முக்கிய தருணங்களை படம் பிடித்தல்.',
    portfolioUrl: 'https://instagram.com/karthik_lens',
    youtubeUrl: '',
    motivation: 'உங்கள் விஜய் நாளிதழின் முதல் பக்க கவர் புகைப்படங்களை எடுக்கும் வாய்ப்பை எதிர்நோக்குகிறேன்.',
    relevantSkills: 'Sony Alpha A7IV, Lightroom editing, drone photography',
    references: '',
    identityReference: '3412',
    consentAccurate: true,
    consentRecruitment: true,
    consentContact: true
  },
  {
    id: 'app-3',
    applicationId: 'UVN-2026-000003',
    applicationStatus: 'Under Review',
    timestamp: '2026-11-02T16:45:00.000Z',
    lastUpdated: '2026-11-02T18:00:00.000Z',
    recruitmentNotes: 'Very enthusiastic video journalist with mobile journalism skills in Puducherry.',
    state: 'Puducherry',
    district: 'Puducherry',
    taluk: 'Oulgaret',
    villageTown: 'Lawspet',
    fullName: 'கவிதா ராஜேந்திரன் (Kavitha Rajendran)',
    guardianName: 'ராஜேந்திரன்',
    dateOfBirth: '2001-02-14',
    gender: 'Female',
    mobileNumber: '9629123456',
    whatsAppNumber: '9629123456',
    isWhatsAppSame: true,
    email: 'kavitha.video@outlook.com',
    residentialAddress: '42, பாரதி வீதி, லாஸ்பேட்டை, புதுச்சேரி - 605008',
    pinCode: '605008',
    positionAppliedFor: 'Video Journalist',
    preferredReportingArea: 'புதுச்சேரி சட்டமன்றம் & மக்கள் நலப் பிரச்னைகள்',
    preferredDistrictTaluk: 'Puducherry - Oulgaret',
    workType: 'Full-time',
    travelAvailability: 'Yes',
    drivingLicence: 'Yes',
    cameraAvailability: 'Yes',
    smartphoneAvailability: 'Yes',
    videoReportingAbility: 'Yes',
    tamilNewsWritingAbility: 'Yes',
    preferredJoiningDate: 'Immediate',
    educationalQualification: 'Undergraduate Degree',
    courseName: 'BA Electronic Media',
    institutionName: 'Pondicherry University Community College',
    languagesKnown: ['Tamil', 'English', 'French'],
    journalismExperience: 'No',
    experienceYears: '0',
    previousOrganisation: '',
    previousDesignation: '',
    previousWorkDetails: '',
    portfolioUrl: '',
    youtubeUrl: 'https://youtube.com/@kavitha_mojotamil',
    motivation: 'புதுச்சேரியின் முக்கிய குரலாக உங்கள் விஜய் நாளிதழில் பணியாற்ற ஆவல் கொண்டுள்ளேன்.',
    relevantSkills: 'Mobile journalism (MoJo), Premiere Pro editing, Live reporting',
    references: '',
    identityReference: '9921',
    consentAccurate: true,
    consentRecruitment: true,
    consentContact: true
  }
];

import { GOOGLE_APPS_SCRIPT_URL } from '../config';

export class ApiService {
  /**
   * Get configured Google Apps Script Web App URL
   * Prioritizes localStorage override (configured via admin settings),
   * then GOOGLE_APPS_SCRIPT_URL from config, then Vite environment variable.
   */
  static getGasUrl(): string {
    return localStorage.getItem(GAS_URL_KEY) || GOOGLE_APPS_SCRIPT_URL || import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || '';
  }

  /**
   * Set or update Google Apps Script URL
   */
  static setGasUrl(url: string): void {
    if (url.trim()) {
      localStorage.setItem(GAS_URL_KEY, url.trim());
    } else {
      localStorage.removeItem(GAS_URL_KEY);
    }
  }

  /**
   * Get all local applications from storage (with default seeds)
   */
  private static getStoredApplications(): ApplicationRecord[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_APPLICATIONS));
      return INITIAL_APPLICATIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_APPLICATIONS;
    }
  }

  /**
   * Save applications back to localStorage
   */
  private static saveApplications(apps: ApplicationRecord[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  }

  /**
   * Test connection to Google Apps Script Web App endpoint
   */
  static async testGasConnection(customUrl?: string): Promise<{ success: boolean; message: string; data?: any }> {
    const url = customUrl || this.getGasUrl();
    if (!url) {
      return {
        success: false,
        message: 'No Google Apps Script Web App URL configured.'
      };
    }

    try {
      const pingUrl = url.includes('?') ? `${url}&action=ping` : `${url}?action=ping`;
      const response = await fetch(pingUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      const text = await response.text();

      // Check if redirected to Google Accounts login (Auth required)
      if (text.includes('accounts.google.com') || text.includes('Sign in - Google Accounts') || response.status === 401) {
        return {
          success: false,
          message: 'Google Apps Script requires Authorization (HTTP 401 / Sign-in). The Web App must be deployed with "Who has access: Anyone" in Google Apps Script deployment settings.'
        };
      }

      let json: any;
      try {
        json = JSON.parse(text);
      } catch {
        return {
          success: false,
          message: `Endpoint returned non-JSON response (HTTP ${response.status}). Ensure the Web App URL is correct.`
        };
      }

      if (json.status === 'success') {
        return {
          success: true,
          message: 'Connected successfully to Google Apps Script Web App! Backend is operational.',
          data: json
        };
      } else {
        return {
          success: false,
          message: json.message || 'Google Apps Script returned an error status.'
        };
      }
    } catch (err: any) {
      return {
        success: false,
        message: `Connection failed: ${err.message || 'Network error or CORS limitation'}. Check that the Web App is deployed with access set to "Anyone".`
      };
    }
  }

  /**
   * Submit Candidate Application
   * Maps all fields explicitly to backend properties.
   * Dispatches to the deployed Google Apps Script Web App endpoint.
   * Inspects network and CORS response without faking success.
   */
  static async submitApplication(formData: ApplicationFormData): Promise<{
    success: boolean;
    applicationId?: string;
    message: string;
    isDuplicate?: boolean;
  }> {
    // 1. Client-side duplicate check against local storage
    const apps = this.getStoredApplications();
    const cleanMobile = formData.mobileNumber.replace(/[^0-9]/g, '');
    const cleanEmail = formData.email.trim().toLowerCase();

    const existing = apps.find(a => 
      a.mobileNumber.replace(/[^0-9]/g, '') === cleanMobile || 
      a.email.trim().toLowerCase() === cleanEmail
    );

    if (existing) {
      return {
        success: false,
        isDuplicate: true,
        applicationId: existing.applicationId,
        message: `A recruitment application has already been registered with this mobile number (${cleanMobile}) or email address. Duplicate applications are not allowed.`
      };
    }

    const gasUrl = this.getGasUrl();
    if (!gasUrl) {
      return {
        success: false,
        message: 'Google Apps Script Web App URL is not configured. Please configure GOOGLE_APPS_SCRIPT_URL.'
      };
    }

    // 2. Explicitly map frontend form fields to backend properties:
    // state, district, taluk, name, mobile, email, position, workType, education, experience, experienceYears
    const payload = {
      action: 'submitApplication',
      payload: {
        state: formData.state,
        district: formData.district,
        taluk: formData.taluk,
        villageTown: formData.villageTown || '',
        name: formData.fullName,
        fullName: formData.fullName,
        guardianName: formData.guardianName || '',
        dateOfBirth: formData.dateOfBirth || '',
        gender: formData.gender || '',
        mobile: formData.mobileNumber,
        mobileNumber: formData.mobileNumber,
        whatsAppNumber: formData.whatsAppNumber || formData.mobileNumber,
        email: formData.email,
        residentialAddress: formData.residentialAddress,
        pinCode: formData.pinCode,
        position: formData.positionAppliedFor,
        positionAppliedFor: formData.positionAppliedFor,
        preferredReportingArea: formData.preferredReportingArea || '',
        preferredDistrictTaluk: formData.preferredDistrictTaluk || '',
        workType: formData.workType || 'Full-time',
        travelAvailability: formData.travelAvailability || 'Yes',
        drivingLicence: formData.drivingLicence || 'No',
        cameraAvailability: formData.cameraAvailability || 'N/A',
        smartphoneAvailability: formData.smartphoneAvailability || 'Yes',
        videoReportingAbility: formData.videoReportingAbility || 'No',
        tamilNewsWritingAbility: formData.tamilNewsWritingAbility || 'Yes',
        education: formData.educationalQualification,
        educationalQualification: formData.educationalQualification,
        courseName: formData.courseName || '',
        institutionName: formData.institutionName || '',
        languagesKnown: formData.languagesKnown || ['Tamil'],
        experience: formData.journalismExperience,
        journalismExperience: formData.journalismExperience,
        experienceYears: formData.experienceYears || '0',
        previousOrganisation: formData.previousOrganisation || '',
        previousDesignation: formData.previousDesignation || '',
        previousWorkDetails: formData.previousWorkDetails || '',
        portfolioUrl: formData.portfolioUrl || '',
        youtubeUrl: formData.youtubeUrl || '',
        joiningDate: formData.preferredJoiningDate || '',
        relevantSkills: formData.relevantSkills || '',
        motivation: formData.motivation || '',
        references: formData.references || '',
        identityReference: formData.identityReference || '',
        consent1: formData.consentAccurate ? 'Yes' : '',
        consent2: formData.consentRecruitment ? 'Yes' : '',
        consent3: formData.consentContact ? 'Yes' : '',
        consentAccurate: formData.consentAccurate,
        consentRecruitment: formData.consentRecruitment,
        consentContact: formData.consentContact,
        resumeBase64: formData.resumeBase64 || '',
        resumeFileName: formData.resumeFileName || '',
        certificateBase64: formData.certificateBase64 || '',
        certificateFileName: formData.certificateFileName || '',
        photoBase64: formData.photoBase64 || '',
        photoFileName: formData.photoFileName || '',
        workSampleBase64: formData.workSampleBase64 || '',
        workSampleFileName: formData.workSampleFileName || ''
      }
    };

    // 3. Dispatch to Google Apps Script endpoint using POST and text/plain to avoid CORS preflight rejection
    try {
      const response = await fetch(gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      const responseText = await response.text();

      // Check for Google Auth redirect or 401
      if (response.status === 401 || responseText.includes('accounts.google.com') || responseText.includes('Sign in - Google Accounts')) {
        return {
          success: false,
          message: 'Google Apps Script Access Restriction (HTTP 401): The Web App currently requires Google Account sign-in. To allow candidates to submit, in Google Apps Script editor click: Deploy > Manage deployments > Edit > set "Who has access" to "Anyone", then click Deploy.'
        };
      }

      let result: any;
      try {
        result = JSON.parse(responseText);
      } catch {
        return {
          success: false,
          message: `Backend returned non-JSON response (HTTP ${response.status}): ${responseText.slice(0, 150)}`
        };
      }

      // Check duplicate status from server
      if (result.status === 'duplicate') {
        return {
          success: false,
          isDuplicate: true,
          applicationId: result.applicationId,
          message: result.message || 'Duplicate application detected on server.'
        };
      }

      // Check error status from server
      if (result.status === 'error') {
        return {
          success: false,
          message: result.message || 'Server rejected the application submission.'
        };
      }

      // Confirmed success from backend!
      if (result.status === 'success' && result.applicationId) {
        const confirmedAppId = result.applicationId;

        // Cache confirmed record locally for instant administrative review
        const newRecord: ApplicationRecord = {
          ...formData,
          id: `app-${Date.now()}`,
          applicationId: confirmedAppId,
          applicationStatus: 'New',
          timestamp: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          recruitmentNotes: ''
        };
        apps.unshift(newRecord);
        this.saveApplications(apps);

        return {
          success: true,
          applicationId: confirmedAppId,
          message: 'Your application has been submitted successfully to UNGAL VIJAY NAALITHAZH Google Sheets.'
        };
      }

      return {
        success: false,
        message: result.message || 'Unexpected response format from Google Apps Script backend.'
      };

    } catch (fetchErr: any) {
      console.error('Apps Script Submission Error:', fetchErr);
      return {
        success: false,
        message: `Network/CORS submission error: ${fetchErr.message || 'Failed to connect to Google Apps Script'}. Ensure the Google Apps Script Web App is deployed with "Who has access: Anyone".`
      };
    }
  }

  /**
   * Get all applications for Admin view
   */
  static async getApplications(): Promise<ApplicationRecord[]> {
    return this.getStoredApplications();
  }

  /**
   * Update application status and private notes
   */
  static async updateApplication(
    applicationId: string, 
    status: ApplicationStatus, 
    notes?: string
  ): Promise<boolean> {
    const apps = this.getStoredApplications();
    const idx = apps.findIndex(a => a.applicationId === applicationId);
    if (idx === -1) return false;

    apps[idx].applicationStatus = status;
    if (notes !== undefined) {
      apps[idx].recruitmentNotes = notes;
    }
    apps[idx].lastUpdated = new Date().toISOString();
    this.saveApplications(apps);

    // If GAS URL configured, update remotely
    const gasUrl = this.getGasUrl();
    if (gasUrl) {
      try {
        await fetch(gasUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: 'updateStatus',
            token: 'UVN_RECRUITMENT_ADMIN_KEY_2026',
            payload: { applicationId, status, notes }
          })
        });
      } catch (e) {
        console.warn('Remote GAS status sync failed:', e);
      }
    }

    return true;
  }
}
