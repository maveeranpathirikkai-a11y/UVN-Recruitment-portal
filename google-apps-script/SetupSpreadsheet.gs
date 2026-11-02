/**
 * UNGAL VIJAY NAALITHAZH — Tamil Daily
 * Spreadsheet Initializer & Database Setup Script
 * 
 * Run this function once from the Apps Script editor: `setupRecruitmentDatabase()`
 * It creates and formats:
 * - Sheet 1: Applications (45 configured columns, colored header, freeze row)
 * - Sheet 2: Location Master (Populated with all 38 Tamil Nadu districts & 4 Puducherry regions + taluks)
 * - Sheet 3: Recruitment Settings (Positions, qualifications, system settings)
 * - Sheet 4: Activity Log (Audit trail)
 * - Creates the Google Drive folder "UVN Recruitment Documents" with restricted access
 */

function setupRecruitmentDatabase() {
  const SPREADSHEET_NAME = "UNGAL VIJAY NAALITHAZH - Recruitment Applications";
  const FOLDER_NAME = "UVN Recruitment Documents";

  Logger.log("Starting UNGAL VIJAY NAALITHAZH Recruitment Database Setup...");

  // 1. Get or create spreadsheet
  let ss;
  const files = DriveApp.getFilesByName(SPREADSHEET_NAME);
  if (files.hasNext()) {
    ss = SpreadsheetApp.open(files.next());
    Logger.log("Found existing spreadsheet: " + ss.getUrl());
  } else {
    ss = SpreadsheetApp.create(SPREADSHEET_NAME);
    Logger.log("Created new spreadsheet: " + ss.getUrl());
  }

  // 2. Setup Google Drive Folder
  const folders = DriveApp.getFoldersByName(FOLDER_NAME);
  let driveFolder;
  if (folders.hasNext()) {
    driveFolder = folders.next();
  } else {
    driveFolder = DriveApp.createFolder(FOLDER_NAME);
    driveFolder.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.VIEW);
  }
  Logger.log("Recruitment Documents Folder ID: " + driveFolder.getId());

  // 3. Setup Sheet 1: Applications
  setupApplicationsSheet(ss);

  // 4. Setup Sheet 2: Location Master
  setupLocationMasterSheet(ss);

  // 5. Setup Sheet 3: Recruitment Settings
  setupRecruitmentSettingsSheet(ss);

  // 6. Setup Sheet 4: Activity Log
  setupActivityLogSheet(ss);

  Logger.log("=== SETUP COMPLETE SUCCESSFULLY ===");
  Logger.log("Spreadsheet URL: " + ss.getUrl());
  Logger.log("Folder URL: " + driveFolder.getUrl());

  return {
    status: "success",
    spreadsheetUrl: ss.getUrl(),
    folderUrl: driveFolder.getUrl()
  };
}

function setupApplicationsSheet(ss) {
  let sheet = ss.getSheetByName("Applications");
  if (!sheet) {
    sheet = ss.insertSheet("Applications", 0);
  }

  const headers = [
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

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format Header: Rich Red background (#991b1b), white bold text
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground("#991b1b");
  headerRange.setFontColor("#ffffff");
  headerRange.setFontWeight("bold");
  headerRange.setFontFamily("Arial");
  headerRange.setHorizontalAlignment("center");
  sheet.setFrozenRows(1);

  // Auto-resize columns
  for (let c = 1; c <= Math.min(headers.length, 25); c++) {
    sheet.setColumnWidth(c, 150);
  }
}

function setupLocationMasterSheet(ss) {
  let sheet = ss.getSheetByName("Location Master");
  if (!sheet) {
    sheet = ss.insertSheet("Location Master", 1);
  }

  const headers = ["State", "District", "Taluk", "District (Tamil)", "Taluk (Tamil)"];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground("#d97706"); // Amber/Gold
  headerRange.setFontColor("#ffffff");
  headerRange.setFontWeight("bold");
  sheet.setFrozenRows(1);

  // Master Location Seed Data
  const locations = [
    // Tamil Nadu - Chennai
    ["Tamil Nadu", "Chennai", "Egmore", "சென்னை", "எழும்பூர்"],
    ["Tamil Nadu", "Chennai", "Guindy", "சென்னை", "கிண்டி"],
    ["Tamil Nadu", "Chennai", "Mylapore", "சென்னை", "மயிலாப்பூர்"],
    ["Tamil Nadu", "Chennai", "Tondiarpet", "சென்னை", "தண்டையார்பேட்டை"],
    ["Tamil Nadu", "Chennai", "Velachery", "சென்னை", "வேளச்சேரி"],
    ["Tamil Nadu", "Chennai", "Aminjikarai", "சென்னை", "அமைந்தகரை"],
    ["Tamil Nadu", "Chennai", "Ayanavaram", "சென்னை", "அயனாவரம்"],
    ["Tamil Nadu", "Chennai", "Mambalam", "சென்னை", "மாம்பலம்"],
    ["Tamil Nadu", "Chennai", "Perambur", "சென்னை", "பெரம்பூர்"],
    ["Tamil Nadu", "Chennai", "Purasawalkam", "சென்னை", "புரசைவாக்கம்"],
    ["Tamil Nadu", "Chennai", "Sholinganallur", "சென்னை", "சோழிங்கநல்லூர்"],
    ["Tamil Nadu", "Chennai", "Alandur", "சென்னை", "ஆலந்தூர்"],
    ["Tamil Nadu", "Chennai", "Madhavaram", "சென்னை", "மாதவரம்"],
    ["Tamil Nadu", "Chennai", "Thiruvottiyur", "சென்னை", "திருவொற்றியூர்"],
    ["Tamil Nadu", "Chennai", "Maduravoyal", "சென்னை", "மதுரவாயல்"],
    
    // Tamil Nadu - Coimbatore
    ["Tamil Nadu", "Coimbatore", "Coimbatore North", "கோயம்புத்தூர்", "கோயம்புத்தூர் வடக்கு"],
    ["Tamil Nadu", "Coimbatore", "Coimbatore South", "கோயம்புத்தூர்", "கோயம்புத்தூர் தெற்கு"],
    ["Tamil Nadu", "Coimbatore", "Pollachi", "கோயம்புத்தூர்", "பொள்ளாச்சி"],
    ["Tamil Nadu", "Coimbatore", "Mettupalayam", "கோயம்புத்தூர்", "மேட்டுப்பாளையம்"],
    ["Tamil Nadu", "Coimbatore", "Sulur", "கோயம்புத்தூர்", "சூலூர்"],
    ["Tamil Nadu", "Coimbatore", "Annur", "கோயம்புத்தூர்", "அன்னூர்"],
    ["Tamil Nadu", "Coimbatore", "Kinathukadavu", "கோயம்புத்தூர்", "கிணத்துக்கடவு"],
    ["Tamil Nadu", "Coimbatore", "Valparai", "கோயம்புத்தூர்", "வால்பாறை"],
    ["Tamil Nadu", "Coimbatore", "Perur", "கோயம்புத்தூர்", "பேரூர்"],
    ["Tamil Nadu", "Coimbatore", "Madukkarai", "கோயம்புத்தூர்", "மதுக்கரை"],

    // Tamil Nadu - Madurai
    ["Tamil Nadu", "Madurai", "Madurai North", "மதுரை", "மதுரை வடக்கு"],
    ["Tamil Nadu", "Madurai", "Madurai South", "மதுரை", "மதுரை தெற்கு"],
    ["Tamil Nadu", "Madurai", "Madurai East", "மதுரை", "மதுரை கிழக்கு"],
    ["Tamil Nadu", "Madurai", "Madurai West", "மதுரை", "மதுரை மேற்கு"],
    ["Tamil Nadu", "Madurai", "Melur", "மதுரை", "மேலூர்"],
    ["Tamil Nadu", "Madurai", "Thirumangalam", "மதுரை", "திருமங்கலம்"],
    ["Tamil Nadu", "Madurai", "Usilampatti", "மதுரை", "உசிலம்பட்டி"],
    ["Tamil Nadu", "Madurai", "Vadipatti", "மதுரை", "வாடிப்பட்டி"],
    ["Tamil Nadu", "Madurai", "Peraiyur", "மதுரை", "பேரையூர்"],
    ["Tamil Nadu", "Madurai", "Thiruparankundram", "மதுரை", "திருப்பரங்குன்றம்"],

    // Tamil Nadu - Tiruchirappalli
    ["Tamil Nadu", "Tiruchirappalli", "Tiruchirappalli East", "திருச்சிராப்பள்ளி", "திருச்சிராப்பள்ளி கிழக்கு"],
    ["Tamil Nadu", "Tiruchirappalli", "Tiruchirappalli West", "திருச்சிராப்பள்ளி", "திருச்சிராப்பள்ளி மேற்கு"],
    ["Tamil Nadu", "Tiruchirappalli", "Srirangam", "திருச்சிராப்பள்ளி", "ஸ்ரீரங்கம்"],
    ["Tamil Nadu", "Tiruchirappalli", "Lalgudi", "திருச்சிராப்பள்ளி", "லால்குடி"],
    ["Tamil Nadu", "Tiruchirappalli", "Manachanallur", "திருச்சிராப்பள்ளி", "மணச்சநல்லூர்"],
    ["Tamil Nadu", "Tiruchirappalli", "Musiri", "திருச்சிராப்பள்ளி", "முசிறி"],
    ["Tamil Nadu", "Tiruchirappalli", "Thuraiyur", "திருச்சிராப்பள்ளி", "துறையூர்"],
    ["Tamil Nadu", "Tiruchirappalli", "Manapparai", "திருச்சிராப்பள்ளி", "மணப்பாறை"],

    // Tamil Nadu - Salem
    ["Tamil Nadu", "Salem", "Salem", "சேலம்", "சேலம்"],
    ["Tamil Nadu", "Salem", "Salem South", "சேலம்", "சேலம் தெற்கு"],
    ["Tamil Nadu", "Salem", "Salem West", "சேலம்", "சேலம் மேற்கு"],
    ["Tamil Nadu", "Salem", "Attur", "சேலம்", "ஆத்தூர்"],
    ["Tamil Nadu", "Salem", "Mettur", "சேலம்", "மேட்டூர்"],
    ["Tamil Nadu", "Salem", "Omalur", "சேலம்", "ஓமலூர்"],
    ["Tamil Nadu", "Salem", "Sankari", "சேலம்", "சங்ககிரி"],

    // Puducherry Regions
    ["Puducherry", "Puducherry", "Puducherry", "புதுச்சேரி", "புதுச்சேரி"],
    ["Puducherry", "Puducherry", "Oulgaret", "புதுச்சேரி", "உழவர்கரை"],
    ["Puducherry", "Puducherry", "Villianur", "புதுச்சேரி", "வில்லியனூர்"],
    ["Puducherry", "Puducherry", "Bahour", "புதுச்சேரி", "பாகூர்"],
    ["Puducherry", "Karaikal", "Karaikal", "காரைக்கால்", "காரைக்கால்"],
    ["Puducherry", "Karaikal", "Thirunallar", "காரைக்கால்", "திருநள்ளாறு"],
    ["Puducherry", "Mahe", "Mahe", "மாகே", "மாகே"],
    ["Puducherry", "Yanam", "Yanam", "ஏனாம்", "ஏனாம்"]
  ];

  if (sheet.getLastRow() <= 1) {
    sheet.getRange(2, 1, locations.length, headers.length).setValues(locations);
  }
}

function setupRecruitmentSettingsSheet(ss) {
  let sheet = ss.getSheetByName("Recruitment Settings");
  if (!sheet) {
    sheet = ss.insertSheet("Recruitment Settings", 2);
  }

  const headers = ["Setting Key", "Setting Value", "Description"];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground("#374151"); // Charcoal
  headerRange.setFontColor("#ffffff");
  headerRange.setFontWeight("bold");
  sheet.setFrozenRows(1);

  const settings = [
    ["PORTAL_ACTIVE", "TRUE", "Recruitment portal status (TRUE/FALSE)"],
    ["RECRUITMENT_YEAR", "2026", "Current recruitment batch year"],
    ["POSITIONS", "Reporter, Photojournalist, Video Journalist", "Available recruitment positions"],
    ["MAX_UPLOAD_SIZE_MB", "5", "Maximum document upload size in megabytes"],
    ["ADMIN_NOTIFICATION_EMAIL", Session.getActiveUser().getEmail() || "admin@ungalvijay.com", "Recipient for application alerts"],
    ["ID_PREFIX", "UVN-2026-", "Prefix for generated Application IDs"]
  ];

  if (sheet.getLastRow() <= 1) {
    sheet.getRange(2, 1, settings.length, headers.length).setValues(settings);
  }
}

function setupActivityLogSheet(ss) {
  let sheet = ss.getSheetByName("Activity Log");
  if (!sheet) {
    sheet = ss.insertSheet("Activity Log", 3);
  }

  const headers = ["Timestamp", "Application ID", "Action Type", "Details", "Performed By"];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground("#1f2937");
  headerRange.setFontColor("#ffffff");
  headerRange.setFontWeight("bold");
  sheet.setFrozenRows(1);
}
