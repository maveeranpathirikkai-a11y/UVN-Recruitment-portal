/**
 * UNGAL VIJAY NAALITHAZH — Tamil Daily
 * Journalist & Photographer Recruitment Portal Backend
 * Google Apps Script Web App
 * 
 * Features:
 * - doPost: Receives application submissions, prevents duplicates, uploads documents to Drive, saves to Sheets.
 * - doGet: Health check, location master data, and authorized admin data fetch.
 * - Concurrency control with LockService.
 * - Formula injection prevention (sanitization).
 * - Secure error handling and JSON responses.
 */

// Global Configuration
const SPREADSHEET_NAME = "UNGAL VIJAY NAALITHAZH - Recruitment Applications";
const FOLDER_NAME = "UVN Recruitment Documents";
const ADMIN_API_KEY = "UVN_RECRUITMENT_ADMIN_KEY_2026"; // Change to your preferred private secret token

/**
 * Handle HTTP GET requests
 * Used for health checks, connection tests, and authenticated administrative queries
 */
function doGet(e) {
  try {
    const action = e.parameter ? e.parameter.action : "ping";
    
    if (action === "ping") {
      return createJsonResponse({
        status: "success",
        message: "UNGAL VIJAY NAALITHAZH Recruitment API is active and operational.",
        timestamp: new Date().toISOString()
      });
    }

    if (action === "getLocations") {
      const locations = getLocationMasterData();
      return createJsonResponse({
        status: "success",
        data: locations
      });
    }

    if (action === "getApplications") {
      // Require administrative authorization
      const token = e.parameter.token;
      if (token !== ADMIN_API_KEY) {
        return createJsonResponse({
          status: "error",
          message: "Unauthorized access: invalid or missing security token."
        }, 401);
      }

      const applications = getAllApplications();
      return createJsonResponse({
        status: "success",
        data: applications
      });
    }

    return createJsonResponse({
      status: "error",
      message: "Unknown action requested."
    }, 400);

  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: "Server error: " + error.toString()
    }, 500);
  }
}

/**
 * Handle HTTP POST requests
 * Handles candidate application submission and admin status updates
 */
function doPost(e) {
  // Use script lock to guarantee atomic ID generation and eliminate race conditions
  const lock = LockService.getScriptLock();
  try {
    // Wait up to 30 seconds for lock
    lock.waitLock(30000);

    let requestData = {};
    if (e && e.postData && e.postData.contents) {
      try {
        requestData = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        requestData = e.parameter || {};
      }
    } else if (e && e.parameter) {
      requestData = e.parameter;
    }

    const action = requestData.action || (e && e.parameter ? e.parameter.action : null) || "submitApplication";
    const payload = requestData.payload || requestData;

    if (action === "submitApplication") {
      return handleApplicationSubmission(payload);
    } else if (action === "updateStatus") {
      // Admin status update
      const token = requestData.token || (e && e.parameter ? e.parameter.token : null);
      if (token !== ADMIN_API_KEY) {
        return createJsonResponse({
          status: "error",
          message: "Unauthorized: Invalid admin token."
        }, 401);
      }
      return handleStatusUpdate(requestData.payload);
    } else {
      return createJsonResponse({
        status: "error",
        message: "Invalid action."
      }, 400);
    }

  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: "Failed to process request: " + error.toString()
    }, 500);
  } finally {
    try {
      lock.releaseLock();
    } catch (e) {
      // Lock may have expired
    }
  }
}

/**
 * Core Application Submission Handler
 */
function handleApplicationSubmission(payload) {
  if (!payload) {
    return createJsonResponse({ status: "error", message: "Payload is empty." }, 400);
  }

  // Normalize field aliases to support both shorthand and full property names
  payload.fullName = payload.name || payload.fullName || "";
  payload.mobileNumber = payload.mobile || payload.mobileNumber || "";
  payload.positionAppliedFor = payload.position || payload.positionAppliedFor || "";
  payload.workType = payload.workType || "Full-time";
  payload.educationalQualification = payload.education || payload.educationalQualification || "";
  payload.journalismExperience = payload.experience || payload.journalismExperience || "No";
  payload.experienceYears = payload.experienceYears || "0";
  if (payload.consent1 === undefined && payload.consentAccurate !== undefined) payload.consent1 = payload.consentAccurate ? "Yes" : "";
  if (payload.consent2 === undefined && payload.consentRecruitment !== undefined) payload.consent2 = payload.consentRecruitment ? "Yes" : "";
  if (payload.consent3 === undefined && payload.consentContact !== undefined) payload.consent3 = payload.consentContact ? "Yes" : "";

  // 1. Validate required fields
  const requiredFields = [
    "state", "district", "taluk", "fullName", "mobileNumber", 
    "email", "residentialAddress", "pinCode", "positionAppliedFor", 
    "educationalQualification", "journalismExperience"
  ];

  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!payload[field] || String(payload[field]).trim() === "") {
      return createJsonResponse({
        status: "error",
        message: "Missing required field: " + field
      }, 400);
    }
  }

  // Mobile number validation (10-digit Indian standard)
  const cleanMobile = String(payload.mobileNumber).replace(/[^0-9]/g, "");
  if (cleanMobile.length < 10) {
    return createJsonResponse({
      status: "error",
      message: "Invalid mobile number. Please provide a valid 10-digit phone number."
    }, 400);
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(payload.email.trim())) {
    return createJsonResponse({
      status: "error",
      message: "Invalid email address format."
    }, 400);
  }

  const ss = getOrCreateSpreadsheet();
  const appSheet = ss.getSheetByName("Applications");

  if (!appSheet) {
    return createJsonResponse({
      status: "error",
      message: "Applications sheet not found. Please run the setup script."
    }, 500);
  }

  // 2. Server-side duplicate check (Mobile & Email)
  const existingRecords = appSheet.getDataRange().getValues();
  // Columns in Applications sheet:
  // Col 11: Mobile Number (index 11), Col 13: Email (index 13)
  for (let r = 1; r < existingRecords.length; r++) {
    const rowMobile = String(existingRecords[r][11] || "").replace(/[^0-9]/g, "");
    const rowEmail = String(existingRecords[r][13] || "").trim().toLowerCase();
    const candidateEmail = String(payload.email || "").trim().toLowerCase();

    if (rowMobile === cleanMobile) {
      return createJsonResponse({
        status: "duplicate",
        message: "A recruitment application has already been registered with this mobile number (" + cleanMobile + "). Duplicate applications are not allowed. Please contact editorial administration for corrections.",
        applicationId: existingRecords[r][1] // Return existing Application ID for reference
      }, 409);
    }

    if (rowEmail === candidateEmail) {
      return createJsonResponse({
        status: "duplicate",
        message: "A recruitment application has already been registered with this email address (" + candidateEmail + "). Duplicate applications are not allowed.",
        applicationId: existingRecords[r][1]
      }, 409);
    }
  }

  // 3. Generate Sequential Unique Application ID: UVN-2026-000001
  const year = new Date().getFullYear();
  const nextSeq = existingRecords.length; // Row count - 1 + 1 = total rows
  const seqPadded = ("000000" + nextSeq).slice(-6);
  const applicationId = "UVN-" + year + "-" + seqPadded;

  // 4. Save uploaded files to restricted Google Drive folder
  const driveFolder = getOrCreateDriveFolder();
  let resumeUrl = "";
  let certificateUrl = "";
  let photoUrl = "";

  if (payload.resumeBase64 && payload.resumeFileName) {
    resumeUrl = saveFileToDrive(driveFolder, applicationId + "_Resume_" + payload.resumeFileName, payload.resumeBase64);
  }
  if (payload.certificateBase64 && payload.certificateFileName) {
    certificateUrl = saveFileToDrive(driveFolder, applicationId + "_Certificate_" + payload.certificateFileName, payload.certificateBase64);
  }
  if (payload.photoBase64 && payload.photoFileName) {
    photoUrl = saveFileToDrive(driveFolder, applicationId + "_Photo_" + payload.photoFileName, payload.photoBase64);
  }

  // 5. Build sanitized spreadsheet row
  const now = new Date();
  const rowData = [
    now,                                     // Timestamp
    applicationId,                           // Application ID
    "New",                                   // Application Status (New, Under Review, Shortlisted, etc.)
    sanitize(payload.state),                 // State
    sanitize(payload.district),              // District
    sanitize(payload.taluk),                 // Taluk
    sanitize(payload.villageTown || ""),     // Village / Town
    sanitize(payload.fullName),              // Full Name
    sanitize(payload.guardianName || ""),    // Guardian Name
    sanitize(payload.dateOfBirth || ""),     // Date of Birth
    sanitize(payload.gender || ""),          // Gender
    cleanMobile,                             // Mobile Number
    sanitize(payload.whatsAppNumber || ""),  // WhatsApp Number
    sanitize(payload.email),                 // Email
    sanitize(payload.residentialAddress),    // Residential Address
    sanitize(payload.pinCode),               // PIN Code
    sanitize(payload.positionAppliedFor),    // Position Applied For
    sanitize(payload.preferredReportingArea || ""), // Preferred Reporting Area
    sanitize(payload.workType || "Full-time"),      // Work Type
    sanitize(payload.travelAvailability || "Yes"),  // Travel Availability
    sanitize(payload.drivingLicence || "No"),       // Driving Licence
    sanitize(payload.cameraAvailability || "N/A"),  // Camera Availability
    sanitize(payload.smartphoneAvailability || "Yes"), // Smartphone Availability
    sanitize(payload.videoReportingAbility || "No"),  // Video Reporting Ability
    sanitize(payload.tamilNewsWritingAbility || "Yes"), // Tamil News Writing Ability
    sanitize(payload.educationalQualification),        // Educational Qualification
    sanitize(payload.courseName || ""),                // Course Name
    sanitize(payload.institutionName || ""),           // Institution Name
    sanitize(Array.isArray(payload.languagesKnown) ? payload.languagesKnown.join(", ") : (payload.languagesKnown || "Tamil")), // Languages
    sanitize(payload.journalismExperience),            // Experience Yes / No
    sanitize(payload.experienceYears || "0"),          // Experience Years
    sanitize(payload.previousOrganisation || ""),      // Previous Organisation
    sanitize(payload.previousDesignation || ""),       // Previous Designation
    sanitize(payload.previousWorkDetails || ""),       // Previous Work Details
    sanitize(payload.portfolioUrl || ""),              // Portfolio URL
    sanitize(payload.youtubeUrl || ""),                // YouTube URL
    sanitize(payload.joiningDate || ""),               // Joining Date
    sanitize(payload.relevantSkills || ""),            // Relevant Skills
    sanitize(payload.motivation || ""),                // Motivation
    resumeUrl,                                         // Resume File URL
    certificateUrl,                                    // Certificate File URL
    photoUrl,                                          // Photo File URL
    sanitize(payload.identityReference || ""),         // Identity Reference (Last 4 digits / Alt ID)
    "Confirmed",                                       // Consent Status
    "",                                                // Recruitment Notes (Private admin)
    now                                                // Last Updated
  ];

  appSheet.appendRow(rowData);

  // 6. Log Activity in Sheet 4
  logActivity(ss, applicationId, "APPLICATION_SUBMITTED", "Candidate submitted application for " + payload.positionAppliedFor);

  return createJsonResponse({
    status: "success",
    message: "Application submitted successfully.",
    applicationId: applicationId,
    timestamp: now.toISOString()
  });
}

/**
 * Handle administrative application status and recruitment notes update
 */
function handleStatusUpdate(payload) {
  if (!payload || !payload.applicationId) {
    return createJsonResponse({ status: "error", message: "Missing application ID." }, 400);
  }

  const ss = getOrCreateSpreadsheet();
  const appSheet = ss.getSheetByName("Applications");
  const data = appSheet.getDataRange().getValues();

  for (let r = 1; r < data.length; r++) {
    if (data[r][1] === payload.applicationId) {
      const rowIndex = r + 1; // 1-indexed sheet row
      
      if (payload.status) {
        appSheet.getRange(rowIndex, 3).setValue(sanitize(payload.status)); // Column C
      }
      if (payload.notes !== undefined) {
        appSheet.getRange(rowIndex, 44).setValue(sanitize(payload.notes)); // Column AR
      }
      appSheet.getRange(rowIndex, 45).setValue(new Date()); // Last Updated

      logActivity(ss, payload.applicationId, "STATUS_UPDATED", "Status changed to " + (payload.status || "unchanged") + (payload.notes ? " | Note added" : ""));

      return createJsonResponse({
        status: "success",
        message: "Application " + payload.applicationId + " updated successfully."
      });
    }
  }

  return createJsonResponse({
    status: "error",
    message: "Application ID not found: " + payload.applicationId
  }, 404);
}

/**
 * Fetch all applications for authorized admin view
 */
function getAllApplications() {
  const ss = getOrCreateSpreadsheet();
  const appSheet = ss.getSheetByName("Applications");
  if (!appSheet) return [];

  const values = appSheet.getDataRange().getValues();
  if (values.length <= 1) return [];

  const headers = values[0];
  const results = [];

  for (let r = 1; r < values.length; r++) {
    const row = values[r];
    results.push({
      timestamp: row[0],
      applicationId: row[1],
      applicationStatus: row[2],
      state: row[3],
      district: row[4],
      taluk: row[5],
      villageTown: row[6],
      fullName: row[7],
      guardianName: row[8],
      dateOfBirth: row[9],
      gender: row[10],
      mobileNumber: row[11],
      whatsAppNumber: row[12],
      email: row[13],
      residentialAddress: row[14],
      pinCode: row[15],
      positionAppliedFor: row[16],
      preferredReportingArea: row[17],
      workType: row[18],
      travelAvailability: row[19],
      drivingLicence: row[20],
      cameraAvailability: row[21],
      smartphoneAvailability: row[22],
      videoReportingAbility: row[23],
      tamilNewsWritingAbility: row[24],
      educationalQualification: row[25],
      courseName: row[26],
      institutionName: row[27],
      languagesKnown: row[28],
      journalismExperience: row[29],
      experienceYears: row[30],
      previousOrganisation: row[31],
      previousDesignation: row[32],
      previousWorkDetails: row[33],
      portfolioUrl: row[34],
      youtubeUrl: row[35],
      joiningDate: row[36],
      relevantSkills: row[37],
      motivation: row[38],
      resumeUrl: row[39],
      certificateUrl: row[40],
      photoUrl: row[41],
      identityReference: row[42],
      consentStatus: row[43],
      recruitmentNotes: row[44],
      lastUpdated: row[45]
    });
  }

  return results;
}

/**
 * Fetch Location Master Data
 */
function getLocationMasterData() {
  const ss = getOrCreateSpreadsheet();
  const locSheet = ss.getSheetByName("Location Master");
  if (!locSheet) return [];

  const values = locSheet.getDataRange().getValues();
  if (values.length <= 1) return [];

  const locations = [];
  for (let r = 1; r < values.length; r++) {
    locations.push({
      state: values[r][0],
      district: values[r][1],
      taluk: values[r][2],
      districtTamil: values[r][3] || "",
      talukTamil: values[r][4] || ""
    });
  }
  return locations;
}

/**
 * Record administrative and system action in Activity Log
 */
function logActivity(ss, applicationId, actionType, details) {
  try {
    const logSheet = ss.getSheetByName("Activity Log");
    if (logSheet) {
      logSheet.appendRow([
        new Date(),
        applicationId,
        actionType,
        details,
        Session.getActiveUser().getEmail() || "System"
      ]);
    }
  } catch (err) {
    Logger.log("Failed to log activity: " + err);
  }
}

/**
 * Helper to get or create Google Drive folder for documents
 */
function getOrCreateDriveFolder() {
  const folders = DriveApp.getFoldersByName(FOLDER_NAME);
  if (folders.hasNext()) {
    return folders.next();
  }
  const newFolder = DriveApp.createFolder(FOLDER_NAME);
  // Keep folder restricted to owner
  newFolder.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.VIEW);
  return newFolder;
}

/**
 * Save Base64 file into Drive folder
 */
function saveFileToDrive(folder, fileName, base64Data) {
  try {
    // Strip possible data URI prefix
    let cleanBase64 = base64Data;
    let mimeType = "application/octet-stream";
    if (base64Data.indexOf(",") > -1) {
      const parts = base64Data.split(",");
      const meta = parts[0];
      cleanBase64 = parts[1];
      const match = meta.match(/:(.*?);/);
      if (match) mimeType = match[1];
    }
    const decoded = Utilities.base64Decode(cleanBase64);
    const blob = Utilities.newBlob(decoded, mimeType, fileName);
    const file = folder.createFile(blob);
    // Return restricted view URL
    return file.getUrl();
  } catch (err) {
    Logger.log("Error saving file to drive: " + err);
    return "";
  }
}

/**
 * Helper to get or create the Spreadsheet
 */
function getOrCreateSpreadsheet() {
  const files = DriveApp.getFilesByName(SPREADSHEET_NAME);
  if (files.hasNext()) {
    return SpreadsheetApp.open(files.next());
  }
  return SpreadsheetApp.create(SPREADSHEET_NAME);
}

/**
 * Prevent formula injection in Google Sheets
 */
function sanitize(val) {
  if (val === null || val === undefined) return "";
  let str = String(val).trim();
  if (str.length > 0 && ("=+-@".indexOf(str.charAt(0)) > -1)) {
    return "'" + str; // Prefix apostrophe to treat as literal text
  }
  return str;
}

/**
 * Helper to format standard JSON response with CORS headers
 */
function createJsonResponse(data, statusCode) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
