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

export class ApiService {
  /**
   * Get configured Google Apps Script Web App URL
   */
  static getGasUrl(): string {
    return localStorage.getItem(GAS_URL_KEY) || import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || '';
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
        message: 'No Google Apps Script Web App URL configured. Using local secure storage mode.'
      };
    }

    try {
      const pingUrl = url.includes('?') ? `${url}&action=ping` : `${url}?action=ping`;
      const response = await fetch(pingUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      const json = await response.json();
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
        message: `Connection failed: ${err.message || 'Network error or CORS limitation'}. Ensure Web App is deployed with access set to "Anyone".`
      };
    }
  }

  /**
   * Submit Application
   * First checks duplicate mobile/email.
   * If GAS URL is configured, dispatches to Google Apps Script.
   * Also stores locally for instant admin access.
   */
  static async submitApplication(formData: ApplicationFormData): Promise<{
    success: boolean;
    applicationId?: string;
    message: string;
    isDuplicate?: boolean;
  }> {
    const apps = this.getStoredApplications();
    const cleanMobile = formData.mobileNumber.replace(/[^0-9]/g, '');
    const cleanEmail = formData.email.trim().toLowerCase();

    // 1. Duplicate check
    const existing = apps.find(a => 
      a.mobileNumber.replace(/[^0-9]/g, '') === cleanMobile || 
      a.email.trim().toLowerCase() === cleanEmail
    );

    if (existing) {
      return {
        success: false,
        isDuplicate: true,
        applicationId: existing.applicationId,
        message: 'Duplicate application detected! An application has already been submitted with this Mobile Number or Email.'
      };
    }

    // 2. Generate sequential unique Application ID
    const year = new Date().getFullYear();
    const nextSeq = apps.length + 1;
    const seqStr = String(nextSeq).padStart(6, '0');
    const newApplicationId = `UVN-${year}-${seqStr}`;

    const newRecord: ApplicationRecord = {
      ...formData,
      id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      applicationId: newApplicationId,
      applicationStatus: 'New',
      timestamp: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      recruitmentNotes: ''
    };

    // 3. Dispatch to Google Apps Script if URL configured
    const gasUrl = this.getGasUrl();
    if (gasUrl) {
      try {
        const payload = {
          action: 'submitApplication',
          payload: {
            ...formData,
            applicationId: newApplicationId
          }
        };

        // Note: Google Apps Script Web Apps often require POST with text/plain to avoid CORS preflight failures
        const gasResponse = await fetch(gasUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        });

        const gasResult = await gasResponse.json();
        if (gasResult.status === 'duplicate') {
          return {
            success: false,
            isDuplicate: true,
            applicationId: gasResult.applicationId,
            message: gasResult.message
          };
        }
      } catch (gasErr) {
        console.warn('Could not post directly to Google Apps Script endpoint, saved locally:', gasErr);
      }
    }

    // 4. Save to local storage
    apps.unshift(newRecord);
    this.saveApplications(apps);

    return {
      success: true,
      applicationId: newApplicationId,
      message: 'Your application has been submitted successfully.'
    };
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
