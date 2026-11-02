# UNGAL VIJAY NAALITHAZH — Journalist & Photographer Recruitment Portal
### உங்கள் விஜய் நாளிதழ் — செய்தியாளர் & புகைப்படக் கலைஞர் தேர்வு போர்ட்டல்

A production-ready, mobile-first bilingual (Tamil & English) recruitment portal for **UNGAL VIJAY NAALITHAZH (Tamil Daily)** designed to recruit qualified Reporters, Photojournalists, and Video Journalists across all 38 districts of Tamil Nadu and the 4 regions of Puducherry.

---

## 1. Strict Brand Asset Compliance

- **Exact Official Logo**: Located at [`public/assets/logo.png`](file:///c:/Users/ADMIN/Desktop/Gravity%20Web%20Development/Ungal%20vijay%20nalidhal%20-%20Interview/public/assets/logo.png).
- **Zero Alteration**: The official logo is preserved exactly as provided — no recolouring, no cropping, no retouching, and aspect ratio preserved.
- **Newspaper Palette**: Rich press red (`#991b1b`), golden yellow (`#d97706` / `#f59e0b`), crisp clean white, and charcoal typography with full Tamil Unicode support (`Noto Sans Tamil`).

---

## 2. Key Portal Features

### A. Multi-Step Application Flow (6 Steps)
1. **Step 1 — Location Details**:
   - Master list of **Tamil Nadu (all 38 districts)** and **Puducherry (4 regions: Puducherry, Karaikal, Mahe, Yanam)**.
   - Dynamic taluk cascading: Selecting a district automatically filters and populates authentic taluks.
   - Resets dependent dropdowns when parent selection changes.
   - Optional Village / Town / Locality field.
2. **Step 2 — Personal Details**:
   - Full Name, Guardian Name, Date of Birth, Gender.
   - Mobile Number (10-digit Indian standard validation).
   - WhatsApp Number with **"Same as mobile number"** checkbox.
   - Email Address format validation.
   - Full Residential Address & PIN Code (6-digit validation).
   - Profile Photo upload with client-side image preview.
   - Duplicate prevention based on mobile and email.
3. **Step 3 — Position and Work Preferences**:
   - Positions: **Reporter (செய்தியாளர்)**, **Photojournalist (புகைப்பட செய்தியாளர்)**, **Video Journalist (வீடியோ செய்தியாளர்)**.
   - Preferred reporting area / beat.
   - Work Type: Full-time / Part-time.
   - Travel availability & Two-wheeler driving licence.
   - Conditional fields: Own camera requirement highlighted for photojournalists; Tamil news writing highlighted for reporters.
4. **Step 4 — Education and Experience**:
   - Highest Educational Qualification (10th, 12th, Diploma, UG, PG, Other).
   - Course Name & College / University.
   - Languages known (Tamil, English, etc.).
   - Journalism Experience toggle (Yes / No).
   - If Yes: reveals total years, previous media organisation, designation, work details, portfolio link, and YouTube channel URL.
   - If No: recorded as fresher with 0 years.
   - Candidate motivation and relevant skills.
5. **Step 5 — Identity, Documents & Declaration**:
   - Optional document uploads (Resume PDF, Educational Certificate, Work Samples, Photo) with 5MB limits.
   - **Data Privacy Assurance**: Full Aadhaar numbers are never collected or stored. Candidates may optionally provide only the last 4 digits of their identity card for interview verification.
   - 3 Mandatory consent checkboxes.
   - Interactive Privacy Policy & Terms modal.
6. **Step 6 — Review & Submission**:
   - Comprehensive newspaper summary card of all entered data.
   - Individual "Edit" button for each section allowing candidates to jump directly to any step.
   - Debounced submission button with loading spinner to prevent accidental double clicks.
   - Sequential unique Application ID generation (e.g. `UVN-2026-000001`).
   - Print-friendly confirmation slip & Download PDF.

---

## 3. Administrative Portal

- **Secure Login**: Access-controlled dashboard at header link.
  - Default Admin Credentials:
    - **Username**: `admin`
    - **Password**: `uvn2026`
- **Real-Time KPI Cards**:
  - Total Applications & Today's submissions.
  - Reporter, Photojournalist, Video Journalist breakdown.
  - Full-time vs Part-time ratio.
  - Experienced vs Fresher counts.
- **Search & Multi-Filters**:
  - Search by Name, Application ID, Mobile, or Email.
  - Filter by State, District, Position, Experience, and Status.
- **Review Drawer / Modal**:
  - Inspect complete applicant details.
  - Change status: `New`, `Under Review`, `Shortlisted`, `Interview Scheduled`, `Selected`, `Rejected`.
  - Add private, internal editorial recruitment notes.
- **Export to CSV / Excel**: One-click download of all filtered records in UTF-8 CSV format.
- **Live Google Sheets Integration Modal**: Test ping connection to the Google Apps Script Web App.

---

## 4. Google Sheets & Google Drive Integration Architecture

Located in [`google-apps-script/`](file:///c:/Users/ADMIN/Desktop/Gravity%20Web%20Development/Ungal%20vijay%20nalidhal%20-%20Interview/google-apps-script/):
- [`Code.gs`](file:///c:/Users/ADMIN/Desktop/Gravity%20Web%20Development/Ungal%20vijay%20nalidhal%20-%20Interview/google-apps-script/Code.gs): Web App backend handling `doPost` (application submissions, duplicate checks, Drive uploads) and `doGet` (health ping, locations, authenticated admin queries).
- [`SetupSpreadsheet.gs`](file:///c:/Users/ADMIN/Desktop/Gravity%20Web%20Development/Ungal%20vijay%20nalidhal%20-%20Interview/google-apps-script/SetupSpreadsheet.gs): Automated database initializer that sets up the 4 sheets:
  1. `Applications` (45 configured columns, red newspaper masthead header)
  2. `Location Master` (Populated with 38 Tamil Nadu districts & 4 Puducherry regions + taluks)
  3. `Recruitment Settings`
  4. `Activity Log` (Audit trail)
- [`README_GOOGLE_SHEETS.md`](file:///c:/Users/ADMIN/Desktop/Gravity%20Web%20Development/Ungal%20vijay%20nalidhal%20-%20Interview/google-apps-script/README_GOOGLE_SHEETS.md): Step-by-step owner deployment guide.

### Configuration Placeholder
```text
GOOGLE_OWNER_EMAIL = "YOUR_GOOGLE_ACCOUNT_EMAIL"
```

### Steps to Deploy to Owner's Google Account:
1. Open [script.google.com](https://script.google.com) and create a New Project.
2. Paste [`Code.gs`](file:///c:/Users/ADMIN/Desktop/Gravity%20Web%20Development/Ungal%20vijay%20nalidhal%20-%20Interview/google-apps-script/Code.gs) and [`SetupSpreadsheet.gs`](file:///c:/Users/ADMIN/Desktop/Gravity%20Web%20Development/Ungal%20vijay%20nalidhal%20-%20Interview/google-apps-script/SetupSpreadsheet.gs).
3. Select `setupRecruitmentDatabase` and click **Run** to generate the spreadsheet and Drive folder automatically.
4. Click **Deploy** -> **New deployment** -> **Web app** (Execute as: Me, Who has access: Anyone).
5. Copy the generated Web App URL and paste it in the portal's **Google Sheets Sync** settings in the Admin Dashboard!

---

## 5. Development & Production Build Commands

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run TypeScript compilation check
npx tsc --noEmit

# Build production bundle
npm run build
```

---

## 6. How to Export Spreadsheet Data to Microsoft Excel

1. Open the Google Spreadsheet: **"UNGAL VIJAY NAALITHAZH - Recruitment Applications"**.
2. Click **File** -> **Download** -> **Microsoft Excel (.xlsx)**.
3. Or, in the Admin Dashboard, click the **Export CSV** button to download the filtered candidate list directly!
