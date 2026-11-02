# UNGAL VIJAY NAALITHAZH — GOOGLE APPS SCRIPT & GOOGLE SHEETS SETUP GUIDE

This guide explains how to connect your **UNGAL VIJAY NAALITHAZH Recruitment Portal** to your Google account for automatic application storage and Drive document uploads.

---

## 1. Google Account Configuration

Before beginning, prepare your Google Account.

```text
GOOGLE_OWNER_EMAIL = "YOUR_GOOGLE_ACCOUNT_EMAIL"
```
*(Replace `YOUR_GOOGLE_ACCOUNT_EMAIL` with your actual Google email, e.g. `editor.ungalvijay@gmail.com`).*

---

## 2. Step-by-Step Setup

### Step 2.1 — Create the Google Apps Script Project
1. Open your browser and go to [script.google.com](https://script.google.com/).
2. Click **New project** (+).
3. In the top-left, rename **"Untitled project"** to **"UNGAL VIJAY NAALITHAZH Recruitment Backend"**.

### Step 2.2 — Copy the Script Files
1. In the Apps Script editor, open `Code.gs`. Replace everything with the code from [`Code.gs`](file:///c:/Users/ADMIN/Desktop/Gravity%20Web%20Development/Ungal%20vijay%20nalidhal%20-%20Interview/google-apps-script/Code.gs).
2. Click the **+** (Add a file) button next to Files, choose **Script**, and name it `SetupSpreadsheet`.
3. Paste the contents from [`SetupSpreadsheet.gs`](file:///c:/Users/ADMIN/Desktop/Gravity%20Web%20Development/Ungal%20vijay%20nalidhal%20-%20Interview/google-apps-script/SetupSpreadsheet.gs).
4. Save the project (Ctrl + S or floppy disk icon).

### Step 2.3 — Initialize the Database
1. In the toolbar at the top, select the function dropdown and pick `setupRecruitmentDatabase`.
2. Click **Run**.
3. A modal will pop up: **"Authorization required"**.
   - Click **Review permissions**.
   - Select your Google Account (`YOUR_GOOGLE_ACCOUNT_EMAIL`).
   - Click **Advanced** -> **Go to UNGAL VIJAY NAALITHAZH Recruitment Backend (unsafe)**.
   - Click **Allow**.
4. Check the Execution log at the bottom. You will see:
   - Created spreadsheet: `UNGAL VIJAY NAALITHAZH - Recruitment Applications`
   - Created Drive folder: `UVN Recruitment Documents`
   - Initialized Sheets: `Applications`, `Location Master`, `Recruitment Settings`, `Activity Log`.

### Step 2.4 — Deploy as Web App
1. At the top right of Google Apps Script, click **Deploy** -> **New deployment**.
2. Click the gear icon (Select type) -> **Web app**.
3. Enter details:
   - **Description**: `UVN Recruitment Web App v1`
   - **Execute as**: `Me (YOUR_GOOGLE_ACCOUNT_EMAIL)`
   - **Who has access**: `Anyone` *(Crucial: allows applicants across Tamil Nadu & Puducherry to submit their applications securely without logging into Google).*
4. Click **Deploy**.
5. Copy the generated **Web app URL** (looks like: `https://script.google.com/macros/s/AKfycb.../exec`).

### Step 2.5 — Connect to the Recruitment Portal
1. Open the Recruitment Portal in your browser.
2. In the Admin Dashboard or `.env` file, configure the endpoint:
   ```env
   VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
   ```
3. You can also paste this URL directly in the **Admin Dashboard -> Google Sheets Integration Settings** modal and click **Test Connection**!

---

## 3. Spreadsheet Architecture & Tabs

The script automatically sets up the following 4 tabs:

| Tab Name | Purpose | Description |
| :--- | :--- | :--- |
| **`Applications`** | Primary applicant database | 45 formatted columns including Application ID, status, contact details, position, experience, work type, document URLs, notes, and timestamps. |
| **`Location Master`** | Master locations | Validated master list of Tamil Nadu's 38 districts and Puducherry's 4 regions with their respective taluks in both English and Tamil. |
| **`Recruitment Settings`** | Editorial configurations | Active status, available positions, year, max upload sizes, and alert email settings. |
| **`Activity Log`** | Audit trail | Records application submissions, status updates, and reviewer activity. |

---

## 4. Security & Privacy Protections

1. **No Frontend Secrets**: The Web App handles all file writes and spreadsheet operations server-side.
2. **Formula Injection Sanitization**: Inputs starting with `=`, `+`, `-`, or `@` are safely prefixed with an apostrophe `'` to prevent spreadsheet command execution.
3. **Restricted Drive Storage**: The `UVN Recruitment Documents` folder is created with Private owner-only permissions.
4. **No Aadhaar Number Storage**: Full Aadhaar numbers are never collected or stored. Candidates may only provide the last 4 digits optionally for verification.
5. **Atomic Duplicate Prevention**: `LockService` prevents race conditions and duplicate applications by checking mobile number and email.

---

## 5. Testing & Verification Checklist

- [ ] Click **Test Connection** in the Admin Portal to verify Web App ping (`doGet`).
- [ ] Submit a test application through the public website.
- [ ] Verify the candidate receives a sequential Application ID (e.g. `UVN-2026-000001`).
- [ ] Check that the record appears in Google Sheets under the `Applications` tab with timestamp and formatted columns.
- [ ] Attempt a duplicate submission with the same mobile or email; verify the friendly duplicate alert is displayed.
- [ ] Check Google Drive to confirm uploaded documents are saved in `UVN Recruitment Documents`.
- [ ] Test changing an applicant's status to `Shortlisted` from the Admin Portal and confirm it reflects in the spreadsheet.
