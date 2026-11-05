export type Language = 'ta' | 'en';

export type PositionType = 
  | 'Reporter' 
  | 'Photojournalist' 
  | 'Video Journalist';

export type WorkType = 'Full-time' | 'Part-time';

export type YesNo = 'Yes' | 'No';

export type ApplicationStatus = 
  | 'New' 
  | 'Under Review' 
  | 'Shortlisted' 
  | 'Interview Scheduled' 
  | 'Selected' 
  | 'Rejected';

export interface LocationItem {
  nameEn: string;
  nameTa: string;
}

export interface DistrictItem {
  id: string;
  nameEn: string;
  nameTa: string;
  taluks: LocationItem[];
}

export interface StateItem {
  id: string;
  nameEn: string;
  nameTa: string;
  districts: DistrictItem[];
}

export interface ApplicationFormData {
  // Step 1: Location Details
  state: string;
  district: string;
  taluk: string;
  villageTown: string;

  // Step 2: Personal Details
  fullName: string;
  guardianName: string;
  dateOfBirth: string;
  gender: string;
  mobileNumber: string;
  whatsAppNumber: string;
  isWhatsAppSame: boolean;
  email: string;
  residentialAddress: string;
  pinCode: string;
  photoBase64?: string;
  photoFileName?: string;

  // Step 3: Position & Work Preferences
  positionAppliedFor: PositionType | '';
  preferredReportingArea: string;
  preferredDistrictTaluk: string;
  workType: WorkType;
  travelAvailability: YesNo;
  drivingLicence: 'Yes' | 'No' | 'Learning' | '';
  cameraAvailability: 'Yes' | 'No' | 'Not Applicable';
  smartphoneAvailability: YesNo;
  videoReportingAbility: YesNo;
  tamilNewsWritingAbility: YesNo;
  preferredJoiningDate: string;

  // Step 4: Education & Experience
  educationalQualification: string;
  courseName: string;
  institutionName: string;
  languagesKnown: string[];
  journalismExperience: YesNo;
  experienceYears: string;
  previousOrganisation: string;
  previousDesignation: string;
  previousWorkDetails: string;
  portfolioUrl: string;
  youtubeUrl: string;
  motivation: string;
  relevantSkills: string;
  references: string;

  // Step 5: Documents & Declaration
  resumeBase64?: string;
  resumeFileName?: string;
  certificateBase64?: string;
  certificateFileName?: string;
  workSampleBase64?: string;
  workSampleFileName?: string;
  identityReference: string; // Optional last 4 digits of ID
  consentAccurate: boolean;
  consentRecruitment: boolean;
  consentContact: boolean;
}

export interface ApplicationRecord extends Omit<Partial<ApplicationFormData>, 'positionAppliedFor' | 'workType' | 'journalismExperience'> {
  id: string;
  applicationId: string;
  status: ApplicationStatus;
  applicationStatus: ApplicationStatus;
  timestamp: string;
  lastUpdated?: string;
  state: string;
  district: string;
  taluk: string;
  name: string;
  fullName: string;
  mobile: string;
  mobileNumber: string;
  email: string;
  position: PositionType | string;
  positionAppliedFor: PositionType | string;
  workType: WorkType | string;
  education: string;
  educationalQualification: string;
  experience: YesNo | string;
  journalismExperience: YesNo | string;
  experienceYears: string;
  recruitmentNotes: string;
  notes?: string;
  resumeUrl?: string;
  certificateUrl?: string;
  photoUrl?: string;
  workSampleUrl?: string;
}

export interface FilterState {
  searchQuery: string;
  state: string;
  district: string;
  taluk: string;
  position: string;
  experience: string;
  status: string;
  workType: string;
}

export interface AdminUser {
  username: string;
  name: string;
  role: 'admin' | 'editor';
  token?: string;
  expiresAt?: number;
}

export interface DashboardStatistics {
  total: number;
  today: number;
  reporter: number;
  photojournalist: number;
  videoJournalist: number;
  fullTime: number;
  partTime: number;
  experienced: number;
  freshers: number;
  districtWise: Record<string, number>;
  statusCounts: Record<string, number>;
}
