import { ApplicationFormData, ApplicationRecord, ApplicationStatus, FilterState, DashboardStatistics, AdminUser } from '../types';
import { GOOGLE_APPS_SCRIPT_URL } from '../config';
import { AuthService } from './auth';

const GAS_URL_KEY = 'uvn_google_apps_script_url';

export class ApiService {
  /**
   * Get configured Google Apps Script Web App URL
   */
  static getGasUrl(): string {
    return localStorage.getItem(GAS_URL_KEY) || GOOGLE_APPS_SCRIPT_URL || import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || '';
  }

  /**
   * Set or update Google Apps Script URL
   */
  static setGasUrl(url: string): void {
    if (url && url.trim()) {
      localStorage.setItem(GAS_URL_KEY, url.trim());
    } else {
      localStorage.removeItem(GAS_URL_KEY);
    }
  }

  /**
   * Normalize an application record from Google Apps Script into a standard ApplicationRecord
   * Guarantees both standard contract fields and component aliases are present.
   */
  static normalizeRecord(raw: any): ApplicationRecord {
    const appId = String(raw.applicationId || raw.id || '').trim();
    let rawStatus = (raw.status || raw.applicationStatus || 'New') as ApplicationStatus;
    // Guard against shifted status column (e.g. if state name was read into status)
    const validStatuses = ['New', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'];
    if (!validStatuses.includes(rawStatus)) {
      rawStatus = 'New';
    }

    let rawFullName = String(raw.fullName || raw.name || '').trim();
    let rawEmail = String(raw.email || '').trim();
    let talukVal = String(raw.taluk || '').trim();
    let districtVal = String(raw.district || '').trim();
    let stateVal = String(raw.state || 'Tamil Nadu').trim();

    // Candidate Name must be mapped from Full Name and email mapped separately from Email.
    // NEVER display email as candidate name:
    if (rawFullName.includes('@')) {
      if (!rawEmail || !rawEmail.includes('@')) {
        rawEmail = rawFullName;
      }
      // If taluk contains the candidate's actual name (due to shifted columns)
      if (talukVal && !talukVal.includes('@')) {
        rawFullName = talukVal;
        if (districtVal && !['tamil nadu', 'kerala', 'karnataka', 'andhra pradesh'].includes(districtVal.toLowerCase())) {
          talukVal = districtVal;
        }
        if (stateVal && !['tamil nadu', 'kerala', 'karnataka', 'andhra pradesh'].includes(stateVal.toLowerCase())) {
          districtVal = stateVal;
          stateVal = 'Tamil Nadu';
        }
      } else {
        rawFullName = rawFullName.split('@')[0];
      }
    }

    // Defensive check: ensure candidate name never contains an email
    if (rawFullName.includes('@')) {
      rawFullName = rawFullName.split('@')[0];
    }

    // Ensure email is mapped separately
    if (!rawEmail.includes('@')) {
      if (String(raw.name || '').includes('@')) {
        rawEmail = String(raw.name).trim();
      } else {
        rawEmail = '';
      }
    }

    const rawMobile = String(raw.mobile || raw.mobileNumber || '').trim();
    const cleanMobile = rawMobile.replace(/[^0-9]/g, '');
    const positionVal = raw.position || raw.positionAppliedFor || 'Reporter';
    const educationVal = raw.education || raw.educationalQualification || 'Undergraduate Degree';
    const rawExp = String(raw.experience || raw.journalismExperience || 'No').trim();
    const expVal = (rawExp.toLowerCase() === 'yes' || rawExp.toLowerCase() === 'true' || rawExp === 'ஆம்') ? 'Yes' : 'No';
    const yearsVal = String(raw.experienceYears || '0').trim();
    const notesVal = String(raw.recruitmentNotes || raw.notes || '').trim();

    let isoTimestamp = '';
    if (raw.timestamp) {
      try {
        isoTimestamp = new Date(raw.timestamp).toISOString();
      } catch {
        isoTimestamp = String(raw.timestamp);
      }
    } else {
      isoTimestamp = new Date().toISOString();
    }

    return {
      // Standard contract fields
      applicationId: appId,
      timestamp: isoTimestamp,
      status: rawStatus,
      state: stateVal || 'Tamil Nadu',
      district: districtVal || '',
      taluk: talukVal || '',
      name: rawFullName,
      mobile: cleanMobile || rawMobile,
      email: rawEmail,
      position: positionVal,
      workType: raw.workType || 'Full-time',
      education: educationVal,
      experience: expVal,
      experienceYears: yearsVal,

      // Component mirror aliases
      id: appId || `app-${Math.random().toString(36).substr(2, 6)}`,
      fullName: rawFullName,
      mobileNumber: cleanMobile || rawMobile,
      applicationStatus: rawStatus,
      positionAppliedFor: positionVal,
      educationalQualification: educationVal,
      journalismExperience: expVal,
      villageTown: raw.villageTown || '',
      guardianName: raw.guardianName || '',
      dateOfBirth: raw.dateOfBirth || '',
      gender: raw.gender || '',
      whatsAppNumber: raw.whatsAppNumber || rawMobile,
      isWhatsAppSame: Boolean(raw.isWhatsAppSame),
      residentialAddress: raw.residentialAddress || '',
      pinCode: raw.pinCode || '',
      preferredReportingArea: raw.preferredReportingArea || '',
      preferredDistrictTaluk: raw.preferredDistrictTaluk || '',
      travelAvailability: raw.travelAvailability || 'Yes',
      drivingLicence: raw.drivingLicence || 'No',
      cameraAvailability: raw.cameraAvailability || 'N/A',
      smartphoneAvailability: raw.smartphoneAvailability || 'Yes',
      videoReportingAbility: raw.videoReportingAbility || 'No',
      tamilNewsWritingAbility: raw.tamilNewsWritingAbility || 'Yes',
      preferredJoiningDate: raw.joiningDate || raw.preferredJoiningDate || '',
      courseName: raw.courseName || '',
      institutionName: raw.institutionName || '',
      languagesKnown: Array.isArray(raw.languagesKnown) ? raw.languagesKnown : (raw.languagesKnown ? [String(raw.languagesKnown)] : ['Tamil']),
      previousOrganisation: raw.previousOrganisation || '',
      previousDesignation: raw.previousDesignation || '',
      previousWorkDetails: raw.previousWorkDetails || '',
      portfolioUrl: raw.portfolioUrl || '',
      youtubeUrl: raw.youtubeUrl || '',
      motivation: raw.motivation || '',
      relevantSkills: raw.relevantSkills || '',
      references: raw.references || '',
      identityReference: raw.identityReference || '',
      consentAccurate: true,
      consentRecruitment: true,
      consentContact: true,
      recruitmentNotes: notesVal,
      notes: notesVal,
      resumeUrl: raw.resumeUrl || '',
      certificateUrl: raw.certificateUrl || '',
      photoUrl: raw.photoUrl || '',
      workSampleUrl: raw.workSampleUrl || '',
      lastUpdated: raw.lastUpdated || isoTimestamp
    };
  }

  /**
   * Test connection to Google Apps Script Web App endpoint
   */
  static async testGasConnection(customUrl?: string): Promise<{ success: boolean; message: string; data?: any; latencyMs?: number }> {
    const url = customUrl || this.getGasUrl();
    if (!url) {
      return {
        success: false,
        message: 'No Google Apps Script Web App URL configured.'
      };
    }

    const startTime = Date.now();
    try {
      const pingUrl = url.includes('?') ? `${url}&action=ping` : `${url}?action=ping`;
      const response = await fetch(pingUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      const latencyMs = Date.now() - startTime;
      const text = await response.text();

      // Check for Google Accounts login redirect
      if (text.includes('accounts.google.com') || text.includes('Sign in - Google Accounts') || response.status === 401) {
        return {
          success: false,
          latencyMs,
          message: 'Google Apps Script Access Restriction (HTTP 401 / Sign-in): The Web App is deployed with restricted access. In Apps Script click: Deploy > Manage deployments > Edit > set "Who has access" to "Anyone", then click Deploy.'
        };
      }

      let json: any;
      try {
        json = JSON.parse(text);
      } catch {
        return {
          success: false,
          latencyMs,
          message: `Endpoint returned non-JSON response (HTTP ${response.status}). Ensure the Web App URL is correct.`
        };
      }

      if (json.success === true || json.status === 'success') {
        return {
          success: true,
          latencyMs,
          message: `Connected successfully to Google Apps Script Web App (${latencyMs}ms). Backend is operational.`,
          data: json
        };
      } else {
        return {
          success: false,
          latencyMs,
          message: json.error || json.message || 'Google Apps Script returned an error status.'
        };
      }
    } catch (err: any) {
      const latencyMs = Date.now() - startTime;
      return {
        success: false,
        latencyMs,
        message: `Connection failed: ${err.message || 'Network error or CORS limitation'}. Check that the Web App is deployed with access set to "Anyone".`
      };
    }
  }

  /**
   * Submit Candidate Application to Google Sheets
   * Maps all fields explicitly to backend properties.
   * Dispatches to the deployed Google Apps Script Web App endpoint.
   */
  static async submitApplication(formData: ApplicationFormData): Promise<{
    success: boolean;
    applicationId?: string;
    message: string;
    isDuplicate?: boolean;
  }> {
    const gasUrl = this.getGasUrl();
    if (!gasUrl) {
      return {
        success: false,
        message: 'Google Apps Script Web App URL is not configured. Please configure GOOGLE_APPS_SCRIPT_URL.'
      };
    }

    const flatFields = {
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
    };

    // Send both flat fields and nested payload for total backend tolerance
    const payload = {
      action: 'submitApplication',
      payload: flatFields,
      ...flatFields
    };

    try {
      const response = await fetch(gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      const responseText = await response.text();

      // Check for Google Auth redirect
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

      // Check duplicate status
      if (result.status === 'duplicate' || result.isDuplicate) {
        return {
          success: false,
          isDuplicate: true,
          applicationId: result.applicationId,
          message: result.message || result.error || 'A recruitment application has already been registered with this mobile number or email address.'
        };
      }

      // Check error status
      if (result.success === false || result.status === 'error') {
        return {
          success: false,
          message: result.error || result.message || 'Server rejected the application submission.'
        };
      }

      // Success confirmed!
      if ((result.success === true || result.status === 'success') && result.applicationId) {
        return {
          success: true,
          applicationId: result.applicationId,
          message: 'Your application has been submitted successfully to UNGAL VIJAY NAALITHAZH Google Sheets.'
        };
      }

      return {
        success: false,
        message: result.message || result.error || 'Unexpected response format from Google Apps Script backend.'
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
   * Fetch LIVE applications from Google Sheets for Admin Portal
   * Connects to doGet(?action=getApplications) and parses { success: true, applications: [...], total: ... }
   * Never falls back to mock records.
   */
  static async getApplications(filter?: FilterState, token?: string): Promise<ApplicationRecord[]> {
    const gasUrl = this.getGasUrl();
    if (!gasUrl) {
      throw new Error('Google Apps Script URL is not configured. Please check settings.');
    }

    const authToken = token || AuthService.getAdminToken();

    // 1. Construct GET request URL with search and filter parameters
    const queryParts = ['action=getApplications'];
    if (authToken) queryParts.push(`token=${encodeURIComponent(authToken)}`);
    if (filter?.state) queryParts.push(`state=${encodeURIComponent(filter.state)}`);
    if (filter?.district) queryParts.push(`district=${encodeURIComponent(filter.district)}`);
    if (filter?.taluk) queryParts.push(`taluk=${encodeURIComponent(filter.taluk)}`);
    if (filter?.position) queryParts.push(`position=${encodeURIComponent(filter.position)}`);
    if (filter?.experience) queryParts.push(`experience=${encodeURIComponent(filter.experience)}`);
    if (filter?.workType) queryParts.push(`workType=${encodeURIComponent(filter.workType)}`);
    if (filter?.status) queryParts.push(`status=${encodeURIComponent(filter.status)}`);
    if (filter?.searchQuery) queryParts.push(`searchQuery=${encodeURIComponent(filter.searchQuery)}`);

    const sep = gasUrl.includes('?') ? '&' : '?';
    const fetchUrl = `${gasUrl}${sep}${queryParts.join('&')}`;

    try {
      let responseText = '';
      let httpStatus = 200;

      // Try GET request first (Standard Web App reading method)
      try {
        const response = await fetch(fetchUrl, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });
        httpStatus = response.status;
        responseText = await response.text();
      } catch (getErr: any) {
        // Fallback to POST if GET encountered a network exception
        console.warn('GET request failed, attempting POST fallback:', getErr);
        const postRes = await fetch(gasUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: 'getApplications',
            token: authToken,
            filter: filter || {}
          })
        });
        httpStatus = postRes.status;
        responseText = await postRes.text();
      }

      // Check for Google Auth redirect
      if (httpStatus === 401 || responseText.includes('accounts.google.com') || responseText.includes('Sign in - Google Accounts')) {
        throw new Error('Google Apps Script Access Restriction (HTTP 401): The Web App deployment is currently restricted to Google account sign-in. To allow the dashboard to load live records, in the Google Apps Script editor click: Deploy > Manage deployments > Edit > set "Who has access" to "Anyone", then click Deploy.');
      }

      let result: any;
      try {
        result = JSON.parse(responseText);
      } catch {
        throw new Error(`Invalid non-JSON response from Google Apps Script (HTTP ${httpStatus}): ${responseText.slice(0, 150)}`);
      }

      // Extract candidate applications list from standard contract
      const rawList = result.applications || result.data;

      if ((result.success === true || result.status === 'success') && Array.isArray(rawList)) {
        return rawList.map((item: any) => ApiService.normalizeRecord(item));
      }

      if (result.success === false || result.status === 'error') {
        throw new Error(result.error || result.message || 'Google Apps Script returned an error.');
      }

      // If response is a health check or running message instead of applications array
      if (result.message && !rawList) {
        throw new Error(`Unexpected data structure returned by Google Apps Script: "${result.message}". Ensure the latest Code.gs is pasted and redeployed with New version.`);
      }

      throw new Error(`Unexpected data structure returned by Google Apps Script: ${JSON.stringify(result).slice(0, 150)}`);

    } catch (err: any) {
      console.error('Error fetching live applications:', err);
      throw err;
    }
  }

  /**
   * Fetch a single application from Google Sheets by ID
   */
  static async getApplicationById(applicationId: string, token?: string): Promise<ApplicationRecord | null> {
    const gasUrl = this.getGasUrl();
    if (!gasUrl) throw new Error('Google Apps Script URL is not configured.');

    const authToken = token || AuthService.getAdminToken();
    const queryParts = [`action=getApplication`, `applicationId=${encodeURIComponent(applicationId)}`];
    if (authToken) queryParts.push(`token=${encodeURIComponent(authToken)}`);
    const sep = gasUrl.includes('?') ? '&' : '?';
    const fetchUrl = `${gasUrl}${sep}${queryParts.join('&')}`;

    try {
      const response = await fetch(fetchUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      const responseText = await response.text();
      let result: any;
      try {
        result = JSON.parse(responseText);
      } catch {
        return null;
      }

      const item = result.application || result.data;
      if ((result.success === true || result.status === 'success') && item) {
        return ApiService.normalizeRecord(item);
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Update Application Status and/or Recruitment Notes in Google Sheets
   * Sends exact backend contract payload:
   * { action: 'updateApplication', applicationId, status, notes }
   * Does NOT send state, district, taluk, name, mobile or other new-application fields.
   */
  static async updateApplication(
    applicationId: string, 
    status: ApplicationStatus, 
    notes?: string
  ): Promise<{ success: boolean; message: string }> {
    const gasUrl = this.getGasUrl();
    if (!gasUrl) {
      throw new Error('Google Apps Script URL is not configured.');
    }

    const payload = {
      action: 'updateApplication',
      applicationId: applicationId,
      status: status,
      notes: notes !== undefined ? notes : ''
    };

    try {
      const response = await fetch(gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      const responseText = await response.text();

      if (response.status === 401 || responseText.includes('accounts.google.com')) {
        throw new Error('Google Apps Script Access Restriction (HTTP 401): Deployment must be set to "Anyone" access.');
      }

      let result: any;
      try {
        result = JSON.parse(responseText);
      } catch {
        throw new Error(`Failed to parse backend response (HTTP ${response.status}): ${responseText.slice(0, 150)}`);
      }

      if (result.success === true || result.status === 'success') {
        return {
          success: true,
          message: result.message || `Application ${applicationId} updated successfully in Google Sheets.`
        };
      }

      throw new Error(result.error || result.message || 'Failed to update application in Google Sheets.');

    } catch (err: any) {
      console.error('Error updating application in Google Sheets:', err);
      throw err;
    }
  }

  /**
   * Authenticate administrator against server-side Google Apps Script backend
   * Issues short-lived, cryptographically signed session token.
   */
  static async adminLogin(username: string, password: string): Promise<{
    success: boolean;
    token: string;
    user: AdminUser;
    expiresAt: number;
    message?: string;
  }> {
    const gasUrl = this.getGasUrl();
    if (!gasUrl) {
      throw new Error('Google Apps Script URL is not configured.');
    }

    const payload = {
      action: 'adminLogin',
      username: username.trim(),
      password: password.trim()
    };

    try {
      const response = await fetch(gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      const responseText = await response.text();

      if (response.status === 401 || responseText.includes('accounts.google.com')) {
        throw new Error('Google Apps Script Access Restriction (HTTP 401): Web App deployment access must be set to "Anyone".');
      }

      let result: any;
      try {
        result = JSON.parse(responseText);
      } catch {
        throw new Error(`Failed to parse backend authentication response (HTTP ${response.status}): ${responseText.slice(0, 150)}`);
      }

      if (result.success === true && result.token) {
        return {
          success: true,
          token: result.token,
          user: result.user || {
            username: username.trim().toLowerCase(),
            name: 'Editorial Administrator',
            role: 'admin',
            token: result.token,
            expiresAt: result.expiresAt
          },
          expiresAt: result.expiresAt || (Date.now() + 2 * 3600 * 1000),
          message: result.message || 'Authenticated successfully.'
        };
      }

      throw new Error(result.error || result.message || 'Invalid administrative credentials.');

    } catch (err: any) {
      console.error('Server-side administrator authentication error:', err);
      throw err;
    }
  }

  /**
   * Delete Application permanently from Google Sheets (Admin Only)
   * Sends action 'deleteApplication' with the selected Application ID and authenticated admin token.
   */
  static async deleteApplication(
    applicationId: string
  ): Promise<{ success: boolean; message: string }> {
    const gasUrl = this.getGasUrl();
    if (!gasUrl) {
      throw new Error('Google Apps Script URL is not configured.');
    }

    const token = AuthService.getAdminToken();
    if (!token) {
      throw new Error('Unauthorized: Administrator authorization required. Please sign in again.');
    }

    const payload = {
      action: 'deleteApplication',
      token: token,
      applicationId: applicationId
    };

    try {
      const response = await fetch(gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      const responseText = await response.text();

      if (response.status === 401 || responseText.includes('accounts.google.com')) {
        throw new Error('Google Apps Script Access Restriction (HTTP 401): Unauthorized access.');
      }

      let result: any;
      try {
        result = JSON.parse(responseText);
      } catch {
        throw new Error(`Failed to parse backend response (HTTP ${response.status}): ${responseText.slice(0, 150)}`);
      }

      if (result.success === true || result.status === 'success') {
        return {
          success: true,
          message: result.message || `Application ${applicationId} removed successfully.`
        };
      }

      throw new Error(result.error || result.message || `Failed to remove application ${applicationId}.`);

    } catch (err: any) {
      console.error('Error removing application from Google Sheets:', err);
      throw err;
    }
  }

  /**
   * Alias for deleteApplication
   */
  static async removeApplication(
    applicationId: string
  ): Promise<{ success: boolean; message: string }> {
    return this.deleteApplication(applicationId);
  }

  /**
   * Calculate live dashboard statistics directly from application rows
   */
  static calculateStatistics(applications: ApplicationRecord[]): DashboardStatistics {
    const todayStr = new Date().toISOString().split('T')[0];
    let today = 0;
    let reporter = 0;
    let photojournalist = 0;
    let videoJournalist = 0;
    let fullTime = 0;
    let partTime = 0;
    let experienced = 0;
    let freshers = 0;
    const districtWise: Record<string, number> = {};
    const statusCounts: Record<string, number> = {};

    applications.forEach((app) => {
      // Today count
      if (app.timestamp && app.timestamp.startsWith(todayStr)) {
        today++;
      }

      // Position count
      const pos = String(app.position || app.positionAppliedFor || '').toLowerCase();
      if (pos.includes('photo')) {
        photojournalist++;
      } else if (pos.includes('video')) {
        videoJournalist++;
      } else {
        reporter++;
      }

      // Work type
      const wt = String(app.workType || '').toLowerCase();
      if (wt.includes('part')) {
        partTime++;
      } else {
        fullTime++;
      }

      // Experience
      const exp = String(app.experience || app.journalismExperience || '').toLowerCase();
      if (exp === 'yes') {
        experienced++;
      } else {
        freshers++;
      }

      // District
      if (app.district) {
        districtWise[app.district] = (districtWise[app.district] || 0) + 1;
      }

      // Status
      const st = app.status || app.applicationStatus || 'New';
      statusCounts[st] = (statusCounts[st] || 0) + 1;
    });

    return {
      total: applications.length,
      today,
      reporter,
      photojournalist,
      videoJournalist,
      fullTime,
      partTime,
      experienced,
      freshers,
      districtWise,
      statusCounts
    };
  }
}
