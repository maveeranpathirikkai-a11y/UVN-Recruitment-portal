/**
 * UNGAL VIJAY NAALITHAZH — Tamil Daily
 * Journalist & Photographer Recruitment Portal Backend
 * Google Apps Script Web App
 * 
 * Consistent JSON API Contract:
 * - Candidate list response structure:
 *   {
 *     "success": true,
 *     "applications": [
 *       {
 *         "applicationId": "UVN-2026-000001",
 *         "timestamp": "ISO_DATE_STRING",
 *         "status": "New",
 *         "state": "Tamil Nadu",
 *         "district": "Krishnagiri",
 *         "taluk": "Krishnagiri",
 *         "name": "Candidate Name",
 *         "mobile": "Candidate Mobile",
 *         "email": "candidate@example.com",
 *         "position": "Reporter",
 *         "workType": "Full-time",
 *         "education": "Undergraduate Degree",
 *         "experience": "Yes",
 *         "experienceYears": "2"
 *       }
 *     ],
 *     "total": 1
 *   }
 * 
 * - Full support for doGet & doPost:
 *   - Health check: action=ping
 *   - Application list: action=getApplications
 *   - Single application lookup: action=getApplication&applicationId=...
 *   - Application submission: action=submitApplication
 *   - Status & notes update: action=updateStatus
 *   - Dashboard statistics: action=getStatistics
 */

// Global Configuration
const SPREADSHEET_NAME = "UNGAL VIJAY NAALITHAZH - Recruitment Applications";
const FOLDER_NAME = "UVN Recruitment Documents";
const ADMIN_API_KEY = "UVN_RECRUITMENT_ADMIN_KEY_2026";

// ============================================================
// SERVER-SIDE SECURITY & AUTHENTICATION (Script Properties)
// ============================================================

/**
 * Constant-time string comparison to prevent timing attacks
 */
function timingSafeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Hash password with salt using SHA-256
 */
function hashPassword(password, salt) {
  const rawBytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    String(salt) + ":" + String(password),
    Utilities.Charset.UTF_8
  );
  let hex = "";
  for (let i = 0; i < rawBytes.length; i++) {
    let byte = rawBytes[i];
    if (byte < 0) byte += 256;
    let byteHex = byte.toString(16);
    if (byteHex.length === 1) byteHex = "0" + byteHex;
    hex += byteHex;
  }
  return hex;
}

/**
 * Retrieve or generate cryptographic HMAC secret in Script Properties
 */
function getOrCreateJwtSecret() {
  const props = PropertiesService.getScriptProperties();
  let secret = props.getProperty("ADMIN_JWT_SECRET");
  if (!secret) {
    secret = Utilities.getUuid() + "-" + Utilities.getUuid() + "-" + Utilities.getUuid();
    props.setProperty("ADMIN_JWT_SECRET", secret);
  }
  return secret;
}

/**
 * Retrieve or initialize administrator credentials in Script Properties
 */
function getSecurityProperties() {
  const props = PropertiesService.getScriptProperties();
  let username = props.getProperty("ADMIN_USERNAME");
  let salt = props.getProperty("ADMIN_SALT");
  let hash = props.getProperty("ADMIN_PASSWORD_HASH");
  
  // Initialize default credentials securely in Script Properties on first use if not present
  if (!username || !salt || !hash) {
    username = "admin";
    salt = Utilities.getUuid().substring(0, 16);
    hash = hashPassword("uvn2026", salt);
    props.setProperties({
      "ADMIN_USERNAME": username,
      "ADMIN_SALT": salt,
      "ADMIN_PASSWORD_HASH": hash,
      "ADMIN_API_KEY": ADMIN_API_KEY
    });
    getOrCreateJwtSecret();
  }
  return { username: username, salt: salt, hash: hash };
}

/**
 * Issue a short-lived, cryptographically signed HMAC-SHA256 session token
 */
function generateSignedSessionToken(username, role) {
  const secret = getOrCreateJwtSecret();
  const header = { alg: "HS256", typ: "JWT" };
  const nowSec = Math.floor(Date.now() / 1000);
  const expSec = nowSec + (30 * 60); // 30 minutes validity (1800 seconds)
  
  const payload = {
    sub: username,
    name: "Editorial Administrator",
    role: role || "admin",
    iat: nowSec,
    exp: expSec,
    jti: Utilities.getUuid()
  };
  
  const headerB64 = Utilities.base64EncodeWebSafe(JSON.stringify(header)).replace(/=+$/, "");
  const payloadB64 = Utilities.base64EncodeWebSafe(JSON.stringify(payload)).replace(/=+$/, "");
  const signingInput = headerB64 + "." + payloadB64;
  const sigBytes = Utilities.computeHmacSha256Signature(signingInput, secret);
  const sigB64 = Utilities.base64EncodeWebSafe(sigBytes).replace(/=+$/, "");
  
  return {
    token: signingInput + "." + sigB64,
    expiresAt: expSec * 1000,
    user: {
      username: username,
      name: "Editorial Administrator",
      role: role || "admin"
    }
  };
}

/**
 * Verify cryptographic signature, expiry, and authorization of session token
 */
function verifyAdminSessionToken(token) {
  if (!token || typeof token !== "string") {
    return { valid: false, error: "Missing authentication token." };
  }
  const parts = String(token).trim().split(".");
  if (parts.length !== 3) {
    return { valid: false, error: "Malformed authentication token format." };
  }
  const headerB64 = parts[0];
  const payloadB64 = parts[1];
  const sigB64 = parts[2];
  
  const secret = getOrCreateJwtSecret();
  const signingInput = headerB64 + "." + payloadB64;
  const expectedSigBytes = Utilities.computeHmacSha256Signature(signingInput, secret);
  const expectedSigB64 = Utilities.base64EncodeWebSafe(expectedSigBytes).replace(/=+$/, "");
  
  if (!timingSafeEqual(sigB64, expectedSigB64)) {
    return { valid: false, error: "Cryptographic signature verification failed: invalid token." };
  }
  
  let payload;
  try {
    const payloadJson = Utilities.newBlob(Utilities.base64DecodeWebSafe(payloadB64)).getDataAsString();
    payload = JSON.parse(payloadJson);
  } catch (e) {
    return { valid: false, error: "Invalid token payload encoding." };
  }
  
  const nowSec = Math.floor(Date.now() / 1000);
  if (!payload.exp || payload.exp < nowSec) {
    return { valid: false, error: "Administrator session has expired. Please log in again." };
  }
  
  if (payload.role !== "admin") {
    return { valid: false, error: "Unauthorized: Administrator privileges required." };
  }
  
  return {
    valid: true,
    username: payload.sub || "admin",
    role: payload.role,
    expiresAt: payload.exp * 1000
  };
}

/**
 * Universal administrator authorization validator
 * Accepts cryptographically signed session tokens or configured admin API key
 */
function isAuthorizedAdmin(token) {
  if (!token) return false;
  // 1. Verify signed session token first
  const tokenResult = verifyAdminSessionToken(token);
  if (tokenResult.valid) {
    return true;
  }
  // 2. Fallback check for configured admin API key
  const props = PropertiesService.getScriptProperties();
  const storedApiKey = props.getProperty("ADMIN_API_KEY") || ADMIN_API_KEY;
  if (storedApiKey && timingSafeEqual(String(token).trim(), storedApiKey)) {
    return true;
  }
  return false;
}

/**
 * Handle server-side administrator authentication (action: adminLogin)
 */
function handleAdminLogin(payload) {
  const username = String(payload.username || "").trim().toLowerCase();
  const password = String(payload.password || "").trim();
  
  if (!username || !password) {
    return createJsonResponse({
      success: false,
      error: "Username and password are required."
    }, 400);
  }
  
  const sec = getSecurityProperties();
  const computedHash = hashPassword(password, sec.salt);
  
  const userMatches = timingSafeEqual(username, sec.username.toLowerCase());
  const passMatches = timingSafeEqual(computedHash, sec.hash);
  
  const ss = getOrCreateSpreadsheet();
  
  if (!userMatches || !passMatches) {
    logActivity(ss, "N/A", "ADMIN_LOGIN", "Failed admin login attempt for user: " + sanitize(username), username, "FAILED");
    return createJsonResponse({
      success: false,
      error: "Invalid administrative username or password."
    }, 401);
  }
  
  const tokenData = generateSignedSessionToken(username, "admin");
  logActivity(ss, "N/A", "ADMIN_LOGIN", "Admin " + username + " authenticated successfully.", username, "SUCCESS");
  
  return createJsonResponse({
    success: true,
    message: "Administrator authenticated successfully.",
    token: tokenData.token,
    expiresAt: tokenData.expiresAt,
    user: tokenData.user
  });
}

/**
 * Utility for Spreadsheet Owner:
 * Update administrator credentials securely in Script Properties.
 * Run this function directly inside the Google Apps Script editor.
 */
function updateAdminCredentials(newUsername, newPassword) {
  if (!newUsername || !newPassword) {
    throw new Error("Both newUsername and newPassword are required.");
  }
  const cleanUser = String(newUsername).trim().toLowerCase();
  const salt = Utilities.getUuid().substring(0, 16);
  const hash = hashPassword(newPassword, salt);
  const props = PropertiesService.getScriptProperties();
  props.setProperties({
    "ADMIN_USERNAME": cleanUser,
    "ADMIN_SALT": salt,
    "ADMIN_PASSWORD_HASH": hash
  });
  // Invalidate any existing sessions by rotating token secret
  props.setProperty("ADMIN_JWT_SECRET", Utilities.getUuid() + "-" + Utilities.getUuid());
  Logger.log("Admin credentials updated in Script Properties for user: " + cleanUser);
}

/**
 * Handle HTTP GET requests
 * Used for health checks, connection tests, and candidate data reading
 */
function doGet(e) {
  try {
    const params = e && e.parameter ? e.parameter : {};
    const action = params.action || "ping";
    
    // 1. Health check response (public)
    if (action === "ping" || action === "health") {
      return createJsonResponse({
        success: true,
        message: "UNGAL VIJAY NAALITHAZH Recruitment API is running.",
        timestamp: new Date().toISOString()
      });
    }

    // 2. Read actual application records (protected admin query)
    if (action === "getApplications" || action === "applications" || action === "read" || action === "list") {
      const token = params.token;
      if (!isAuthorizedAdmin(token)) {
        return createJsonResponse({
          success: false,
          error: "Unauthorized access: invalid or missing security token."
        }, 401);
      }
      const applications = getAllApplications(params);
      return createJsonResponse({
        success: true,
        applications: applications,
        total: applications.length
      });
    }

    // 3. Read a single application by Application ID (protected admin query)
    if (action === "getApplication") {
      const token = params.token;
      if (!isAuthorizedAdmin(token)) {
        return createJsonResponse({
          success: false,
          error: "Unauthorized access: invalid or missing security token."
        }, 401);
      }
      const appId = params.applicationId || params.id;
      if (!appId) {
        return createJsonResponse({
          success: false,
          error: "Missing applicationId parameter."
        }, 400);
      }
      const app = getApplicationById(appId);
      if (!app) {
        return createJsonResponse({
          success: false,
          error: "Application not found: " + appId
        }, 404);
      }
      return createJsonResponse({
        success: true,
        application: app
      });
    }

    // 4. Dashboard live statistics
    if (action === "getStatistics") {
      const stats = calculateLiveStatistics();
      return createJsonResponse({
        success: true,
        statistics: stats,
        total: stats.total
      });
    }

    // 5. Location Master Data
    if (action === "getLocations") {
      const locations = getLocationMasterData();
      return createJsonResponse({
        success: true,
        locations: locations
      });
    }

    // Default: Return running status
    return createJsonResponse({
      success: true,
      message: "UNGAL VIJAY NAALITHAZH Recruitment API is running.",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return createJsonResponse({
      success: false,
      error: "Server error: " + error.toString()
    }, 500);
  }
}

/**
 * Handle HTTP POST requests
 * Handles candidate submissions, status updates, and authenticated queries
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000); // Wait up to 30s for lock

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

    // Merge requestData and requestData.payload so properties can be at root or under payload
    let payload = {};
    if (requestData.payload && typeof requestData.payload === "object") {
      payload = Object.assign({}, requestData, requestData.payload);
    } else {
      payload = Object.assign({}, requestData);
    }

    // Determine action from requestData, payload, or URL parameter
    const rawAction = String(
      requestData.action || 
      payload.action || 
      (e && e.parameter ? e.parameter.action : "") || 
      ""
    ).trim();
    const action = rawAction.toLowerCase();

    const token = requestData.token || payload.token || (e && e.parameter ? e.parameter.token : null);
    payload.token = token;

    // ============================================================
    // STEP 3: EXPLICIT ACTION ROUTING AT THE VERY BEGINNING
    // ============================================================

    // 0. Administrator Authentication (server-side login)
    if (action === "adminlogin" || action === "login") {
      return handleAdminLogin(payload);
    }

    // 1. Health check via POST (public)
    if (action === "ping" || action === "health") {
      return createJsonResponse({
        success: true,
        message: "UNGAL VIJAY NAALITHAZH Recruitment API is active (POST).",
        timestamp: new Date().toISOString()
      });
    }

    // 2. UPDATE APPLICATION FIRST - strictly updates existing candidate row without new-candidate validation
    if (action === "updateapplication" || action === "updatestatus") {
      return handleStatusUpdate(payload);
    }

    // 3. DELETE APPLICATION FIRST - strictly deletes existing candidate row without new-candidate validation
    if (action === "deleteapplication" || action === "removeapplication") {
      return handleApplicationRemoval(payload);
    }

    // 4. Update Notes only (Administrative)
    if (action === "updatenotes") {
      return handleNotesUpdate(payload);
    }

    // 5. Get Applications via POST (Administrative)
    if (action === "getapplications" || action === "read" || action === "list") {
      if (!isAuthorizedAdmin(token)) {
        return createJsonResponse({ success: false, error: "Unauthorized access: invalid admin token." }, 401);
      }
      const filterCriteria = payload.filter || payload || {};
      const applications = getAllApplications(filterCriteria);
      return createJsonResponse({
        success: true,
        applications: applications,
        total: applications.length
      });
    }

    // 6. Get Single Application via POST (Administrative)
    if (action === "getapplication") {
      if (!isAuthorizedAdmin(token)) {
        return createJsonResponse({ success: false, error: "Unauthorized access: invalid admin token." }, 401);
      }
      const appId = payload.applicationId || payload.id;
      if (!appId) {
        return createJsonResponse({ success: false, error: "Missing applicationId parameter." }, 400);
      }
      const app = getApplicationById(appId);
      if (!app) {
        return createJsonResponse({ success: false, error: "Application not found: " + appId }, 404);
      }
      return createJsonResponse({ success: true, application: app });
    }

    // 7. Get Statistics via POST
    if (action === "getstatistics") {
      const stats = calculateLiveStatistics();
      return createJsonResponse({
        success: true,
        statistics: stats,
        total: stats.total
      });
    }

    // 8. If payload has applicationId and (status or notes) without candidate submission fields, route to handleStatusUpdate
    if (payload.applicationId && (payload.status || payload.notes !== undefined) && !payload.state && !payload.district) {
      return handleStatusUpdate(payload);
    }

    // 9. Candidate Application Submission
    // Run ONLY if action is explicitly 'submitApplication', OR if action is empty and new-application fields are present
    if (action === "submitapplication" || (!action && (payload.fullName || payload.name || payload.state))) {
      return handleApplicationSubmission(payload);
    }

    return createJsonResponse({
      success: false,
      error: "Invalid action requested: " + (rawAction || "none")
    }, 400);

  } catch (error) {
    return createJsonResponse({
      success: false,
      error: "Failed to process request: " + error.toString()
    }, 500);
  } finally {
    try {
      lock.releaseLock();
    } catch (e) {
      // Lock release
    }
  }
}

/**
 * Core Application Submission Handler
 */
function handleApplicationSubmission(payload) {
  if (!payload) {
    return createJsonResponse({ success: false, error: "Payload is empty." }, 400);
  }

  // Normalize aliases to support both shorthand and full property names
  payload.fullName = payload.name || payload.fullName || "";
  payload.mobileNumber = payload.mobile || payload.mobileNumber || "";
  payload.positionAppliedFor = payload.position || payload.positionAppliedFor || "Reporter";
  payload.workType = payload.workType || "Full-time";
  payload.educationalQualification = payload.education || payload.educationalQualification || "Undergraduate Degree";
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
        success: false,
        error: "Missing required field: " + field
      }, 400);
    }
  }

  // 2. Validate mobile number (10 digits)
  const cleanMobile = String(payload.mobileNumber).replace(/[^0-9]/g, "");
  if (cleanMobile.length < 10) {
    return createJsonResponse({
      success: false,
      error: "Invalid mobile number. Must contain at least 10 digits."
    }, 400);
  }

  // 3. Connect to Spreadsheet
  const ss = getOrCreateSpreadsheet();
  let appSheet = ss.getSheetByName("Applications");
  if (!appSheet) {
    appSheet = ss.insertSheet("Applications", 0);
  }

  const data = appSheet.getDataRange().getValues();
  const headerMap = getHeaderIndexMap(data[0] || []);

  // 4. Duplicate Check
  const mobileCol = headerMap["mobilenumber"] !== undefined ? headerMap["mobilenumber"] : 11;
  const emailCol = headerMap["email"] !== undefined ? headerMap["email"] : 13;
  const cleanEmail = String(payload.email).trim().toLowerCase();

  for (let r = 1; r < data.length; r++) {
    const rowMobile = String(data[r][mobileCol] || "").replace(/[^0-9]/g, "");
    const rowEmail = String(data[r][emailCol] || "").trim().toLowerCase();
    
    if (rowMobile === cleanMobile || (cleanEmail && rowEmail === cleanEmail)) {
      const existingId = data[r][headerMap["applicationid"] !== undefined ? headerMap["applicationid"] : 1];
      return createJsonResponse({
        success: false,
        status: "duplicate",
        isDuplicate: true,
        applicationId: existingId,
        message: "An application with this mobile number or email already exists (" + existingId + ").",
        error: "An application with this mobile number or email already exists (" + existingId + ")."
      });
    }
  }

  // 5. Generate Atomic Application ID
  const now = new Date();
  const year = now.getFullYear();
  let maxSeq = 0;
  const idCol = headerMap["applicationid"] !== undefined ? headerMap["applicationid"] : 1;

  for (let r = 1; r < data.length; r++) {
    const cellVal = String(data[r][idCol] || "").trim();
    if (cellVal.indexOf("UVN-") === 0) {
      const parts = cellVal.split("-");
      if (parts.length >= 3) {
        const num = parseInt(parts[2], 10);
        if (!isNaN(num) && num > maxSeq) {
          maxSeq = num;
        }
      }
    }
  }

  const nextSeq = maxSeq + 1;
  const seqStr = ("00000" + nextSeq).slice(-5);
  const applicationId = "UVN-" + year + "-" + seqStr;

  // 6. Handle Document Uploads to Drive
  let resumeUrl = "";
  let certificateUrl = "";
  let photoUrl = "";

  if (payload.resumeBase64 || payload.certificateBase64 || payload.photoBase64) {
    const folder = getOrCreateDriveFolder();
    if (payload.resumeBase64) {
      const fileName = applicationId + "_Resume_" + (payload.resumeFileName || "Document.pdf");
      resumeUrl = saveFileToDrive(folder, fileName, payload.resumeBase64);
    }
    if (payload.certificateBase64) {
      const fileName = applicationId + "_Certificate_" + (payload.certificateFileName || "Document.pdf");
      certificateUrl = saveFileToDrive(folder, fileName, payload.certificateBase64);
    }
    if (payload.photoBase64) {
      const fileName = applicationId + "_Photo_" + (payload.photoFileName || "Photo.jpg");
      photoUrl = saveFileToDrive(folder, fileName, payload.photoBase64);
    }
  }

  // 7. Prepare Row Data according to 46-column schema
  const rowData = [
    now,                                     // Timestamp
    applicationId,                           // Application ID
    "New",                                   // Application Status
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
    sanitize(payload.identityReference || ""),         // Identity Reference
    "Confirmed",                                       // Consent Status
    "",                                                // Recruitment Notes
    now                                                // Last Updated
  ];

  appSheet.appendRow(rowData);

  // 8. Log Activity
  logActivity(ss, applicationId, "APPLICATION_SUBMITTED", "Candidate submitted application for " + payload.positionAppliedFor);

  return createJsonResponse({
    success: true,
    message: "Application submitted successfully.",
    applicationId: applicationId,
    timestamp: now.toISOString()
  });
}

/**
 * Helper to find column index from normalized header map with alias list and fallback
 */
function findColIndex(map, possibleNames, fallback) {
  if (!map) return fallback;
  for (let i = 0; i < possibleNames.length; i++) {
    const key = String(possibleNames[i]).toLowerCase().replace(/[^a-z0-9]/g, "");
    if (map[key] !== undefined) {
      return map[key];
    }
  }
  return fallback;
}

/**
 * Handle administrative application status and recruitment notes update
 * Locates existing application row strictly by Application ID.
 * Updates ONLY Application Status and Private Recruitment Notes columns.
 * Never runs new-application validation and never overwrites candidate fields.
 */
function handleStatusUpdate(payload) {
  const appId = payload.applicationId || (payload.payload && payload.payload.applicationId);
  if (!appId || String(appId).trim() === "") {
    return createJsonResponse({ success: false, error: "Missing application ID." }, 400);
  }

  const cleanAppId = String(appId).trim();

  const ss = getOrCreateSpreadsheet();
  const appSheet = ss.getSheetByName("Applications");
  if (!appSheet) {
    return createJsonResponse({ success: false, error: "Applications sheet not found." }, 404);
  }

  const data = appSheet.getDataRange().getValues();
  if (data.length <= 1) {
    return createJsonResponse({ success: false, error: "No applications found in sheet." }, 404);
  }

  const headerMap = getHeaderIndexMap(data[0] || []);

  const idCol = findColIndex(headerMap, ["applicationid", "appid", "id"], 1);
  const statusCol = findColIndex(headerMap, ["applicationstatus", "status", "candidatestatus"], 2);
  const notesCol = findColIndex(headerMap, ["recruitmentnotes", "notes", "adminnotes", "privatenotes"], 44);
  const updatedCol = findColIndex(headerMap, ["lastupdated", "updatedat", "lastmodified"], 45);

  for (let r = 1; r < data.length; r++) {
    if (String(data[r][idCol]).trim() === cleanAppId) {
      const rowIndex = r + 1; // 1-indexed sheet row
      
      const newStatus = payload.status || payload.applicationStatus;
      if (newStatus) {
        appSheet.getRange(rowIndex, statusCol + 1).setValue(sanitize(newStatus));
      }
      const noteVal = payload.notes !== undefined ? payload.notes : (payload.recruitmentNotes !== undefined ? payload.recruitmentNotes : undefined);
      if (noteVal !== undefined) {
        appSheet.getRange(rowIndex, notesCol + 1).setValue(sanitize(noteVal));
      }
      if (updatedCol !== undefined) {
        appSheet.getRange(rowIndex, updatedCol + 1).setValue(new Date());
      }

      logActivity(ss, cleanAppId, "STATUS_UPDATED", "Status: " + (newStatus || "unchanged") + (noteVal !== undefined ? " | Note updated" : ""));

      return createJsonResponse({
        success: true,
        message: "Application " + cleanAppId + " updated successfully in Google Sheets."
      });
    }
  }

  return createJsonResponse({
    success: false,
    error: "Application ID not found: " + cleanAppId
  }, 404);
}

/**
 * Handle administrative notes update only
 */
function handleNotesUpdate(payload) {
  if (!payload || !payload.applicationId) {
    return createJsonResponse({ success: false, error: "Missing application ID." }, 400);
  }
  return handleStatusUpdate(payload);
}

/**
 * Handle administrative application removal / deletion
 * Permanently deletes the candidate row strictly identified by unique Application ID.
 * Strictly protected by server-side administrator token verification.
 */
function handleApplicationRemoval(payload) {
  const token = payload.token || (payload.payload && payload.payload.token);
  if (!token) {
    return createJsonResponse({
      success: false,
      error: "Unauthorized: Administrator authorization token required."
    }, 401);
  }

  const tokenCheck = verifyAdminSessionToken(token);
  if (!tokenCheck.valid) {
    const ss = getOrCreateSpreadsheet();
    logActivity(ss, String(payload.applicationId || "N/A"), "APPLICATION_DELETION", "Unauthorized delete attempt: " + (tokenCheck.error || "invalid token"), "Unauthorized User", "FAILED");
    return createJsonResponse({
      success: false,
      error: tokenCheck.error || "Unauthorized: Invalid or expired administrator session token."
    }, 401);
  }

  const adminIdentity = tokenCheck.username;

  const appId = payload.applicationId || (payload.payload && payload.payload.applicationId);
  if (!appId || String(appId).trim() === "") {
    return createJsonResponse({
      success: false,
      error: "Missing required parameter: applicationId"
    }, 400);
  }

  const cleanAppId = String(appId).trim();

  const ss = getOrCreateSpreadsheet();
  const appSheet = ss.getSheetByName("Applications");
  if (!appSheet) {
    return createJsonResponse({
      success: false,
      error: "Applications sheet not found."
    }, 404);
  }

  const data = appSheet.getDataRange().getValues();
  if (data.length <= 1) {
    return createJsonResponse({
      success: false,
      error: "No applications found in sheet."
    }, 404);
  }

  const headerMap = getHeaderIndexMap(data[0] || []);
  const idCol = findColIndex(headerMap, ["applicationid", "appid", "id"], 1);
  const nameCol = findColIndex(headerMap, ["fullname", "name", "candidatename"], 7);

  let targetRowIndex = -1;
  let candidateName = "";

  for (let r = 1; r < data.length; r++) {
    if (String(data[r][idCol]).trim() === cleanAppId) {
      targetRowIndex = r + 1; // 1-indexed row for Google Sheets API
      candidateName = String(data[r][nameCol] || "").trim();
      break;
    }
  }

  if (targetRowIndex === -1) {
    return createJsonResponse({
      success: false,
      error: "Application not found with ID: " + cleanAppId
    }, 404);
  }

  // Delete ONLY this single application row
  appSheet.deleteRow(targetRowIndex);

  // Record action in Activity Log with admin identity, timestamp, action, details, and result
  logActivity(ss, cleanAppId, "APPLICATION_DELETED", "Application for " + (candidateName || "Candidate") + " (" + cleanAppId + ") was permanently deleted.", adminIdentity, "SUCCESS");

  return createJsonResponse({
    success: true,
    action: "deleteApplication",
    applicationId: cleanAppId,
    message: "Application " + cleanAppId + " removed successfully."
  });
}

/**
 * Fetch all applications with optional search and filter criteria
 */
function getAllApplications(filter) {
  const ss = getOrCreateSpreadsheet();
  const appSheet = ss.getSheetByName("Applications");
  if (!appSheet) return [];

  const values = appSheet.getDataRange().getValues();
  if (values.length <= 1) return [];

  const headers = values[0];
  const headerMap = getHeaderIndexMap(headers);
  const results = [];

  const fState = filter && filter.state ? String(filter.state).trim().toLowerCase() : null;
  const fDistrict = filter && filter.district ? String(filter.district).trim().toLowerCase() : null;
  const fTaluk = filter && filter.taluk ? String(filter.taluk).trim().toLowerCase() : null;
  const fPosition = filter && filter.position ? String(filter.position).trim().toLowerCase() : null;
  const fExperience = filter && filter.experience ? String(filter.experience).trim().toLowerCase() : null;
  const fWorkType = filter && filter.workType ? String(filter.workType).trim().toLowerCase() : null;
  const fStatus = filter && filter.status ? String(filter.status).trim().toLowerCase() : null;
  const fSearch = filter && (filter.searchQuery || filter.q) ? String(filter.searchQuery || filter.q).trim().toLowerCase() : null;

  for (let r = 1; r < values.length; r++) {
    const row = values[r];
    const appId = String(row[headerMap["applicationid"] || 1] || "").trim();
    const candidateName = String(row[headerMap["fullname"] || 7] || "").trim();
    if (!appId && !candidateName) {
      continue; // Skip blank rows safely
    }

    const app = mapRowToApplicationObject(row, headerMap);

    // Apply Filters
    if (fState && String(app.state || "").toLowerCase() !== fState) continue;
    if (fDistrict && String(app.district || "").toLowerCase() !== fDistrict) continue;
    if (fTaluk && String(app.taluk || "").toLowerCase() !== fTaluk) continue;
    if (fPosition && String(app.position || "").toLowerCase() !== fPosition) continue;
    if (fWorkType && String(app.workType || "").toLowerCase() !== fWorkType) continue;
    if (fStatus && String(app.status || "").toLowerCase() !== fStatus) continue;

    if (fExperience) {
      if (fExperience === "experienced" && String(app.experience || "").toLowerCase() !== "yes") continue;
      if (fExperience === "fresher" && String(app.experience || "").toLowerCase() !== "no") continue;
    }

    if (fSearch) {
      const matchId = String(app.applicationId || "").toLowerCase().includes(fSearch);
      const matchName = String(app.name || "").toLowerCase().includes(fSearch);
      const matchMobile = String(app.mobile || "").includes(fSearch);
      const matchEmail = String(app.email || "").toLowerCase().includes(fSearch);
      if (!matchId && !matchName && !matchMobile && !matchEmail) continue;
    }

    results.push(app);
  }

  // Sort newest first
  results.reverse();
  return results;
}

/**
 * Get single application by ID
 */
function getApplicationById(applicationId) {
  if (!applicationId) return null;
  const ss = getOrCreateSpreadsheet();
  const appSheet = ss.getSheetByName("Applications");
  if (!appSheet) return null;

  const values = appSheet.getDataRange().getValues();
  if (values.length <= 1) return null;

  const headerMap = getHeaderIndexMap(values[0]);
  const idCol = headerMap["applicationid"] !== undefined ? headerMap["applicationid"] : 1;

  for (let r = 1; r < values.length; r++) {
    if (String(values[r][idCol]).trim() === String(applicationId).trim()) {
      return mapRowToApplicationObject(values[r], headerMap);
    }
  }
  return null;
}

/**
 * Calculate live statistics directly from spreadsheet rows
 */
function calculateLiveStatistics() {
  const ss = getOrCreateSpreadsheet();
  const appSheet = ss.getSheetByName("Applications");
  if (!appSheet) {
    return { total: 0, today: 0, reporter: 0, photojournalist: 0, videoJournalist: 0, fullTime: 0, partTime: 0, experienced: 0, freshers: 0, districtWise: {}, statusCounts: {} };
  }

  const values = appSheet.getDataRange().getValues();
  if (values.length <= 1) {
    return { total: 0, today: 0, reporter: 0, photojournalist: 0, videoJournalist: 0, fullTime: 0, partTime: 0, experienced: 0, freshers: 0, districtWise: {}, statusCounts: {} };
  }

  const headerMap = getHeaderIndexMap(values[0]);
  const todayStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || "GMT+5:30", "yyyy-MM-dd");

  let total = 0;
  let today = 0;
  let reporter = 0;
  let photojournalist = 0;
  let videoJournalist = 0;
  let fullTime = 0;
  let partTime = 0;
  let experienced = 0;
  let freshers = 0;
  const districtWise = {};
  const statusCounts = {};

  for (let r = 1; r < values.length; r++) {
    const row = values[r];
    const appId = String(row[headerMap["applicationid"] || 1] || "").trim();
    if (!appId) continue;
    const app = mapRowToApplicationObject(row, headerMap);

    total++;

    // Today count
    if (app.timestamp) {
      try {
        const tsDate = Utilities.formatDate(new Date(app.timestamp), Session.getScriptTimeZone() || "GMT+5:30", "yyyy-MM-dd");
        if (tsDate === todayStr) today++;
      } catch (e) {
        // Date parse fallback
      }
    }

    // Position count
    const pos = String(app.position || "").toLowerCase();
    if (pos.includes("photo")) photojournalist++;
    else if (pos.includes("video")) videoJournalist++;
    else reporter++;

    // Work type
    const wt = String(app.workType || "").toLowerCase();
    if (wt.includes("part")) partTime++;
    else fullTime++;

    // Experience
    const exp = String(app.experience || "").toLowerCase();
    if (exp === "yes") experienced++;
    else freshers++;

    // District-wise
    if (app.district) {
      districtWise[app.district] = (districtWise[app.district] || 0) + 1;
    }

    // Status counts
    const st = app.status || "New";
    statusCounts[st] = (statusCounts[st] || 0) + 1;
  }

  return {
    total: total,
    today: today,
    reporter: reporter,
    photojournalist: photojournalist,
    videoJournalist: videoJournalist,
    fullTime: fullTime,
    partTime: partTime,
    experienced: experienced,
    freshers: freshers,
    districtWise: districtWise,
    statusCounts: statusCounts
  };
}

/**
 * Dynamic Header Normalization Mapping
 */
function getHeaderIndexMap(headers) {
  const map = {};
  for (let c = 0; c < headers.length; c++) {
    const raw = String(headers[c] || "").trim();
    const norm = raw.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (norm) {
      map[norm] = c;
    }
  }
  return map;
}

/**
 * Map Spreadsheet Row to Candidate Application Object safely
 * Follows exact required JSON API contract:
 * { applicationId, timestamp, status, state, district, taluk, name, mobile, email, position, workType, education, experience, experienceYears }
 */
function mapRowToApplicationObject(row, map) {
  function getVal(keys, fallbackIndex) {
    if (!Array.isArray(keys)) keys = [keys];
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i].toLowerCase().replace(/[^a-z0-9]/g, "");
      if (map[k] !== undefined) {
        const v = row[map[k]];
        return (v !== undefined && v !== null) ? v : "";
      }
    }
    if (fallbackIndex !== undefined && fallbackIndex < row.length) {
      const v = row[fallbackIndex];
      return (v !== undefined && v !== null) ? v : "";
    }
    return "";
  }

  const appId = String(getVal(["applicationid", "appid", "id"], 1)).trim();
  let rawStatus = String(getVal(["applicationstatus", "status", "candidatestatus"], 2) || "New").trim();
  let fullName = String(getVal(["fullname", "candidatename", "name"], 7)).trim();
  let rawMobile = String(getVal(["mobilenumber", "mobile", "phone", "phonenumber"], 11)).trim();
  let cleanMobile = rawMobile.replace(/[^0-9]/g, "");
  let emailVal = String(getVal(["email", "emailaddress"], 13) || "").trim();
  let talukVal = String(getVal(["taluk", "tehsil"], 5) || "").trim();
  let districtVal = String(getVal(["district", "city"], 4) || "").trim();
  let stateVal = String(getVal(["state", "region"], 3) || "Tamil Nadu").trim();

  // Guard: NEVER display email as candidate name
  if (fullName.indexOf("@") !== -1) {
    if (!emailVal || emailVal.indexOf("@") === -1) {
      emailVal = fullName;
    }
    if (talukVal && talukVal.indexOf("@") === -1) {
      fullName = talukVal;
      if (districtVal && districtVal !== "Tamil Nadu") {
        talukVal = districtVal;
      }
      if (stateVal && stateVal !== "Tamil Nadu") {
        districtVal = stateVal;
        stateVal = "Tamil Nadu";
      }
    } else {
      fullName = fullName.split("@")[0];
    }
  }

  if (fullName.indexOf("@") !== -1) {
    fullName = fullName.split("@")[0];
  }

  const positionVal = String(getVal(["positionappliedfor", "position", "role", "appliedfor"], 16) || "Reporter").trim();
  const educationVal = String(getVal(["educationalqualification", "education", "qualification"], 25) || "Undergraduate Degree").trim();
  const rawExp = String(getVal(["experienceyesno", "journalismexperience", "experience"], 29) || "No").trim();
  const experienceVal = (rawExp.toLowerCase() === "yes" || rawExp.toLowerCase() === "true" || rawExp === "ஆம்") ? "Yes" : "No";
  const experienceYearsVal = String(getVal(["experienceyears", "years", "yearsofexperience"], 30) || "0").trim();
  const notesVal = String(getVal(["recruitmentnotes", "notes", "adminnotes"], 44) || "").trim();
  const rawTimestamp = getVal(["timestamp", "date", "createdat", "time"], 0);

  let isoTimestamp = "";
  if (rawTimestamp) {
    try {
      isoTimestamp = new Date(rawTimestamp).toISOString();
    } catch (e) {
      isoTimestamp = String(rawTimestamp);
    }
  } else {
    isoTimestamp = new Date().toISOString();
  }

  const rawLanguages = getVal(["languagesknown", "languages"], 28);
  let languagesList = [];
  if (Array.isArray(rawLanguages)) {
    languagesList = rawLanguages;
  } else if (rawLanguages) {
    languagesList = String(rawLanguages).split(",").map(function(s) { return s.trim(); });
  } else {
    languagesList = ["Tamil"];
  }

  return {
    // Exact API Contract Fields:
    applicationId: appId,
    timestamp: isoTimestamp,
    status: rawStatus,
    state: stateVal || "Tamil Nadu",
    district: districtVal,
    taluk: talukVal,
    name: fullName,
    mobile: cleanMobile || rawMobile,
    email: emailVal,
    position: positionVal,
    workType: String(getVal(["worktype", "jobtype"], 18) || "Full-time").trim(),
    education: educationVal,
    experience: experienceVal,
    experienceYears: experienceYearsVal,

    // Component Mirror Aliases for 100% UI compatibility:
    id: appId || ("app-" + Math.random().toString(36).substr(2, 6)),
    fullName: fullName,
    mobileNumber: cleanMobile || rawMobile,
    applicationStatus: rawStatus,
    positionAppliedFor: positionVal,
    educationalQualification: educationVal,
    journalismExperience: experienceVal,
    villageTown: getVal(["villagetown", "village", "town"], 6),
    guardianName: getVal(["guardianname", "fathername"], 8),
    dateOfBirth: getVal(["dateofbirth", "dob"], 9),
    gender: getVal(["gender", "sex"], 10),
    whatsAppNumber: String(getVal(["whatsappnumber", "whatsapp"], 12) || rawMobile).trim(),
    residentialAddress: getVal(["residentialaddress", "address"], 14),
    pinCode: String(getVal(["pincode", "postalcode", "zip"], 15)).trim(),
    preferredReportingArea: getVal(["preferredreportingarea", "reportingarea"], 17),
    travelAvailability: getVal(["travelavailability", "travel"], 19) || "Yes",
    drivingLicence: getVal(["drivinglicence", "license", "licence"], 20) || "No",
    cameraAvailability: getVal(["cameraavailability", "camera", "owncamera"], 21) || "N/A",
    smartphoneAvailability: getVal(["smartphoneavailability", "smartphone"], 22) || "Yes",
    videoReportingAbility: getVal(["videoreportingability", "videoreporting"], 23) || "No",
    tamilNewsWritingAbility: getVal(["tamilnewswritingability", "tamilwriting"], 24) || "Yes",
    courseName: getVal(["coursename", "course", "degree"], 26),
    institutionName: getVal(["institutionname", "institution", "college", "university"], 27),
    languagesKnown: languagesList,
    previousOrganisation: getVal(["previousorganisation", "organization", "company"], 31),
    previousDesignation: getVal(["previousdesignation", "designation", "previousrole"], 32),
    previousWorkDetails: getVal(["previousworkdetails", "workdetails"], 33),
    portfolioUrl: getVal(["portfoliourl", "portfolio"], 34),
    youtubeUrl: getVal(["youtubeurl", "youtube"], 35),
    joiningDate: getVal(["joiningdate", "preferredjoiningdate"], 36),
    relevantSkills: getVal(["relevantskills", "skills"], 37),
    motivation: getVal(["motivation"], 38),
    resumeUrl: getVal(["resumefileurl", "resumeurl", "resume"], 39),
    certificateUrl: getVal(["certificatefileurl", "certificateurl", "certificate"], 40),
    photoUrl: getVal(["photofileurl", "photourl", "photo"], 41),
    identityReference: getVal(["identityreference", "idreference", "idproof"], 42),
    consentStatus: getVal(["consentstatus", "consent"], 43) || "Confirmed",
    recruitmentNotes: notesVal,
    notes: notesVal,
    lastUpdated: getVal(["lastupdated", "updatedat"], 45) || isoTimestamp
  };
}

/**
 * Location Master Data
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
 * Record action in Activity Log
 * Columns: Timestamp | Administrator Identity | Application ID | Action | Details | Result
 * Never records passwords or signing secrets.
 */
function logActivity(ss, applicationId, actionType, details, adminUser, resultStatus) {
  try {
    let logSheet = ss.getSheetByName("Activity Log");
    if (!logSheet) {
      logSheet = ss.insertSheet("Activity Log");
      logSheet.appendRow(["Timestamp", "Administrator Identity", "Application ID", "Action", "Details", "Result"]);
    }
    logSheet.appendRow([
      new Date(),
      adminUser || Session.getActiveUser().getEmail() || "System",
      applicationId || "N/A",
      actionType,
      details,
      resultStatus || "SUCCESS"
    ]);
  } catch (err) {
    Logger.log("Failed to log activity: " + err);
  }
}

/**
 * Google Drive folder for documents
 */
function getOrCreateDriveFolder() {
  const folders = DriveApp.getFoldersByName(FOLDER_NAME);
  if (folders.hasNext()) {
    return folders.next();
  }
  const newFolder = DriveApp.createFolder(FOLDER_NAME);
  newFolder.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.VIEW);
  return newFolder;
}

/**
 * Save Base64 file into Drive folder
 */
function saveFileToDrive(folder, fileName, base64Data) {
  try {
    let cleanBase64 = base64Data;
    let mimeType = "application/octet-stream";
    if (base64Data.indexOf(",") > -1) {
      const parts = base64Data.split(",");
      cleanBase64 = parts[1];
      const match = parts[0].match(/:(.*?);/);
      if (match) mimeType = match[1];
    }
    const decoded = Utilities.base64Decode(cleanBase64);
    const blob = Utilities.newBlob(decoded, mimeType, fileName);
    const file = folder.createFile(blob);
    return file.getUrl();
  } catch (err) {
    Logger.log("Error saving file to drive: " + err);
    return "";
  }
}

/**
 * Helper to get or create Spreadsheet
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
    return "'" + str;
  }
  return str;
}

/**
 * Create JSON response ensuring both success boolean and legacy status
 */
function createJsonResponse(data, statusCode) {
  if (data.success === undefined) {
    data.success = (data.status === "success");
  }
  if (data.status === undefined) {
    data.status = data.success ? "success" : "error";
  }
  if (data.error && !data.message) {
    data.message = data.error;
  } else if (data.message && !data.error && !data.success) {
    data.error = data.message;
  }
  if (data.applications && !data.data) {
    data.data = data.applications;
  } else if (data.data && !data.applications) {
    data.applications = data.data;
  }
  if (data.total !== undefined && data.count === undefined) {
    data.count = data.total;
  } else if (data.count !== undefined && data.total === undefined) {
    data.total = data.count;
  }

  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
