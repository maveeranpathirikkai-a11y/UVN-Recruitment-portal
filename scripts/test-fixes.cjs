/**
 * Test Suite for FIX 1 and FIX 2 in google-apps-script/Code.gs
 * Tests:
 * 1. updateApplication (changes status to Rejected and adds notes, preserves all candidate fields)
 * 2. deleteApplication (removes candidate strictly by Application ID, preserves other rows)
 * 3. Ordinary candidate submission (full validation and save)
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('=== RUNNING TESTS FOR FIX 1 AND FIX 2 ===\n');

// 1. Create Mock Environment for Google Apps Script
const codeGsPath = path.join(__dirname, '..', 'google-apps-script', 'Code.gs');
const codeGsContent = fs.readFileSync(codeGsPath, 'utf8');

// Actual Spreadsheet Headers
const mockHeaders = [
  "Timestamp", "Application ID", "Application Status", "State", "District", 
  "Taluk", "Village / Town", "Full Name", "Guardian Name", "Date of Birth", 
  "Gender", "Mobile Number", "WhatsApp Number", "Email", "Residential Address", 
  "PIN Code", "Position Applied For", "Preferred Reporting Area", "Work Type", 
  "Travel Availability", "Driving Licence", "Camera Availability", "Smartphone Availability", 
  "Video Reporting Ability", "Tamil News Writing Ability", "Educational Qualification", 
  "Course Name", "Institution Name", "Languages Known", "Experience Yes / No", 
  "Experience Years", "Previous Organisation", "Previous Designation", "Previous Work Details", 
  "Portfolio URL", "YouTube URL", "Joining Date", "Relevant Skills", "Motivation", 
  "Resume File URL", "Certificate File URL", "Photo File URL", "Identity Reference", 
  "Consent Status", "Recruitment Notes", "Last Updated"
];

let mockRows = [
  [...mockHeaders],
  [
    "2026-11-02T10:00:00Z", "UVN-2026-000001", "New", "Tamil Nadu", "Chennai",
    "Mylapore", "Mandaveli", "K. Vijayakumar", "Krishnan", "1995-05-12",
    "Male", "9876543210", "9876543210", "vijay@example.com", "12 Bharathi Salai, Chennai",
    "600004", "Reporter", "Crime & Politics", "Full-time",
    "Yes", "Yes", "N/A", "Yes",
    "Yes", "Yes", "Postgraduate Degree",
    "MA Journalism", "Madras University", "Tamil, English", "Yes",
    "3", "Daily Thanthi", "Sub Editor", "Covered state elections",
    "https://portfolio.example.com", "https://youtube.com/@vijay", "2026-12-01", "Speed typing, Camera operation", "Passion for true journalism",
    "https://drive.google.com/resume1.pdf", "https://drive.google.com/cert1.pdf", "https://drive.google.com/photo1.jpg", "1234",
    "Accepted", "Initial screening pending", "2026-11-02T10:00:00Z"
  ],
  [
    "2026-11-02T11:00:00Z", "UVN-2026-000002", "New", "Tamil Nadu", "Madurai",
    "Madurai North", "Simmakkal", "P. Anitha", "Perumal", "1998-08-20",
    "Female", "9123456780", "9123456780", "anitha@example.com", "45 Meenakshi Street, Madurai",
    "625001", "Photojournalist", "Culture & Features", "Full-time",
    "Yes", "Yes", "Yes", "Yes",
    "No", "Yes", "Diploma",
    "Diploma in Photography", "Madurai Kamaraj Univ", "Tamil", "No",
    "0", "", "", "",
    "https://anitha.photo", "", "2026-11-15", "Wildlife & street photography", "Love visual storytelling",
    "", "", "", "5678",
    "Accepted", "", "2026-11-02T11:00:00Z"
  ]
];

const mockActivityLog = [
  ["Timestamp", "Application ID", "Action", "Details", "User"]
];

const mockAppSheet = {
  getName: () => "Applications",
  getDataRange: () => ({
    getValues: () => mockRows.map(r => [...r])
  }),
  getRange: (row, col) => ({
    setValue: (val) => {
      mockRows[row - 1][col - 1] = val;
    }
  }),
  deleteRow: (rowPosition) => {
    mockRows.splice(rowPosition - 1, 1);
  },
  appendRow: (row) => {
    mockRows.push(row);
  }
};

const mockActivitySheet = {
  getName: () => "Activity Log",
  appendRow: (row) => {
    mockActivityLog.push(row);
  }
};

const mockSpreadsheet = {
  getSheetByName: (name) => {
    if (name === "Applications") return mockAppSheet;
    if (name === "Activity Log") return mockActivitySheet;
    return null;
  },
  insertSheet: (name) => mockAppSheet
};

const sandbox = {
  SpreadsheetApp: {
    open: () => mockSpreadsheet,
    create: () => mockSpreadsheet
  },
  DriveApp: {
    getFilesByName: () => ({
      hasNext: () => true,
      next: () => ({})
    }),
    getFoldersByName: () => ({
      hasNext: () => true,
      next: () => ({
        createFile: () => ({ getUrl: () => 'https://mock.drive.url' })
      })
    })
  },
  LockService: {
    getScriptLock: () => ({
      waitLock: () => true,
      releaseLock: () => true
    })
  },
  ContentService: {
    createTextOutput: (jsonString) => ({
      jsonString,
      setMimeType: () => {},
      getContent: () => JSON.parse(jsonString)
    }),
    MimeType: { JSON: 'application/json' }
  },
  Session: {
    getActiveUser: () => ({
      getEmail: () => 'admin@ungalvijay.com'
    }),
    getScriptTimeZone: () => 'GMT+5:30'
  },
  Logger: {
    log: (msg) => console.log('  [GAS Logger]', msg)
  },
  Utilities: {
    base64Decode: () => [],
    newBlob: () => ({}),
    formatDate: (d, tz, fmt) => '2026-11-04'
  },
  console
};

vm.createContext(sandbox);
vm.runInContext(codeGsContent, sandbox);

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log('  PASS:', message);
    passed++;
  } else {
    console.error('  FAIL:', message);
    failed++;
  }
}

// ==========================================
// TEST A: UPDATE APPLICATION (action: "updateApplication")
// ==========================================
console.log('--- TEST A: Update Application Status & Notes ---');

// Test 1: Update without authorization token -> Should return 401
const unauthUpdateRes = sandbox.doPost({
  postData: {
    contents: JSON.stringify({
      action: 'updateApplication',
      applicationId: 'UVN-2026-000001',
      status: 'Rejected'
    })
  }
}).getContent();

assert(unauthUpdateRes.success === false, 'Unauthorized update rejected (success=false)');
assert(unauthUpdateRes.error.includes('Unauthorized'), 'Unauthorized update returned security error');

// Test 2: Valid update: Change status to 'Rejected' and add private notes
const validUpdateRes = sandbox.doPost({
  postData: {
    contents: JSON.stringify({
      action: 'updateApplication',
      token: 'UVN_RECRUITMENT_ADMIN_KEY_2026',
      applicationId: 'UVN-2026-000001',
      status: 'Rejected',
      notes: 'Did not meet language fluency requirements for senior reporter beat.'
    })
  }
}).getContent();

assert(validUpdateRes.success === true, 'Update succeeded (NO "Missing required field: state" error!)');
assert(validUpdateRes.message.includes('UVN-2026-000001'), 'Update confirmation message returned');

// Verify that in the spreadsheet row:
// Column 3 (Application Status) is updated to "Rejected"
// Column 45 (Recruitment Notes) is updated to private notes
// All other candidate fields remain 100% intact!
const updatedRow = mockRows[1];
assert(updatedRow[1] === 'UVN-2026-000001', 'Application ID UVN-2026-000001 preserved');
assert(updatedRow[2] === 'Rejected', 'Application Status changed to "Rejected" in Column C');
assert(updatedRow[44] === 'Did not meet language fluency requirements for senior reporter beat.', 'Recruitment Notes persisted in Column AS');
assert(updatedRow[3] === 'Tamil Nadu', 'State preserved ("Tamil Nadu")');
assert(updatedRow[4] === 'Chennai', 'District preserved ("Chennai")');
assert(updatedRow[5] === 'Mylapore', 'Taluk preserved ("Mylapore")');
assert(updatedRow[7] === 'K. Vijayakumar', 'Full Name preserved ("K. Vijayakumar")');
assert(updatedRow[11] === '9876543210', 'Mobile Number preserved ("9876543210")');
assert(updatedRow[13] === 'vijay@example.com', 'Email preserved ("vijay@example.com")');
assert(updatedRow[16] === 'Reporter', 'Position preserved ("Reporter")');

console.log('');

// ==========================================
// TEST B: DELETE APPLICATION (action: "deleteApplication")
// ==========================================
console.log('--- TEST B: Delete Application ---');

// Test 3: Delete without token -> Should return 401
const unauthDeleteRes = sandbox.doPost({
  postData: {
    contents: JSON.stringify({
      action: 'deleteApplication',
      applicationId: 'UVN-2026-000001'
    })
  }
}).getContent();

assert(unauthDeleteRes.success === false, 'Unauthorized delete rejected');

// Test 4: Delete with invalid token -> Should return 401
const badTokenDeleteRes = sandbox.doPost({
  postData: {
    contents: JSON.stringify({
      action: 'deleteApplication',
      token: 'INVALID_TOKEN',
      applicationId: 'UVN-2026-000001'
    })
  }
}).getContent();

assert(badTokenDeleteRes.success === false, 'Invalid token delete rejected');

// Test 5: Delete nonexistent application ID -> Should return 404
const notFoundDeleteRes = sandbox.doPost({
  postData: {
    contents: JSON.stringify({
      action: 'deleteApplication',
      token: 'UVN_RECRUITMENT_ADMIN_KEY_2026',
      applicationId: 'NONEXISTENT-ID'
    })
  }
}).getContent();

assert(notFoundDeleteRes.success === false, 'Nonexistent ID rejected with error');

// Test 6: Delete test candidate UVN-2026-000001
const rowCountBefore = mockRows.length; // 3
const validDeleteRes = sandbox.doPost({
  postData: {
    contents: JSON.stringify({
      action: 'deleteApplication',
      token: 'UVN_RECRUITMENT_ADMIN_KEY_2026',
      applicationId: 'UVN-2026-000001'
    })
  }
}).getContent();

assert(validDeleteRes.success === true, 'Delete succeeded (NO "Missing required field: state" error!)');
assert(mockRows.length === rowCountBefore - 1, 'Exactly one row was deleted from sheet');

const remainingIds = mockRows.slice(1).map(r => r[1]);
assert(!remainingIds.includes('UVN-2026-000001'), 'UVN-2026-000001 is removed from sheet');
assert(remainingIds.includes('UVN-2026-000002'), 'Other candidate UVN-2026-000002 is preserved');

// Verify Activity Log
const lastLog = mockActivityLog[mockActivityLog.length - 1];
assert(lastLog[2] === 'APPLICATION_REMOVED', 'Activity Log recorded APPLICATION_REMOVED');
assert(lastLog[1] === 'UVN-2026-000001', 'Activity Log recorded correct ID');

console.log('');

// ==========================================
// TEST C: ORDINARY CANDIDATE SUBMISSION
// ==========================================
console.log('--- TEST C: Ordinary Candidate Submission ---');

const submissionRes = sandbox.doPost({
  postData: {
    contents: JSON.stringify({
      action: 'submitApplication',
      payload: {
        state: 'Tamil Nadu',
        district: 'Salem',
        taluk: 'Salem South',
        fullName: 'R. Murugan',
        mobileNumber: '9988776655',
        email: 'murugan@example.com',
        residentialAddress: '10 Anna Nagar, Salem',
        pinCode: '636001',
        positionAppliedFor: 'Video Journalist',
        educationalQualification: 'Undergraduate Degree',
        journalismExperience: 'No'
      }
    })
  }
}).getContent();

assert(submissionRes.success === true, 'New candidate submission succeeded');
assert(submissionRes.applicationId !== undefined, 'New Application ID generated: ' + submissionRes.applicationId);

console.log(`\n=== TEST SUMMARY: ${passed} PASSED, ${failed} FAILED ===`);
if (failed > 0) process.exit(1);
