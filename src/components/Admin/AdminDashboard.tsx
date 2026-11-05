import React, { useState, useEffect } from 'react';
import { ApplicationRecord, FilterState, Language, AdminUser } from '../../types';
import { ApiService } from '../../services/api';
import { KPICards } from './KPICards';
import { ApplicationDetailModal } from './ApplicationDetailModal';
import { GASConfigModal } from './GASConfigModal';
import { LOCATION_MASTER_DATA, getDistrictsForState } from '../../data/locations';
import { 
  Search, 
  Download, 
  Cloud, 
  LogOut, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  Inbox
} from 'lucide-react';

interface AdminDashboardProps {
  currentLang: Language;
  onLogout: () => void;
  currentUser: AdminUser;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentLang,
  onLogout,
  currentUser
}) => {
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [selectedApp, setSelectedApp] = useState<ApplicationRecord | null>(null);
  const [isGasModalOpen, setIsGasModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 8;

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    state: '',
    district: '',
    taluk: '',
    position: '',
    experience: '',
    status: '',
    workType: ''
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ApiService.getApplications(undefined, currentUser.token);
      setApplications(data);
      setLoading(false);
    } catch (err: any) {
      console.error('Failed to fetch live applications:', err);
      setError(err.message || 'Failed to fetch live applications from Google Sheets.');
      setApplications([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Client-side filter logic over the live dataset
  const filteredApps = applications.filter((app) => {
    // Search query: ID, Name, Mobile, Email
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchId = String(app.applicationId || '').toLowerCase().includes(q);
      const matchName = String(app.name || app.fullName || '').toLowerCase().includes(q);
      const matchMobile = String(app.mobile || app.mobileNumber || '').includes(q);
      const matchEmail = String(app.email || '').toLowerCase().includes(q);
      if (!matchId && !matchName && !matchMobile && !matchEmail) return false;
    }

    // State filter
    if (filters.state && String(app.state || '').toLowerCase() !== filters.state.toLowerCase()) return false;

    // District filter
    if (filters.district && String(app.district || '').toLowerCase() !== filters.district.toLowerCase()) return false;

    // Position filter
    if (filters.position) {
      const p = String(app.position || app.positionAppliedFor || '');
      if (p !== filters.position) return false;
    }

    // Experience filter
    if (filters.experience) {
      const expVal = String(app.experience || app.journalismExperience || '').toLowerCase();
      if (filters.experience === 'Experienced' && expVal !== 'yes') return false;
      if (filters.experience === 'Fresher' && expVal !== 'no') return false;
    }

    // Status filter
    if (filters.status) {
      const st = String(app.status || app.applicationStatus || '');
      if (st !== filters.status) return false;
    }

    // Work type filter
    if (filters.workType && app.workType !== filters.workType) return false;

    return true;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredApps.length / itemsPerPage) || 1;
  const paginatedApps = filteredApps.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // CSV Export handler (Uses real live records)
  const handleExportCSV = () => {
    if (filteredApps.length === 0) {
      alert('No applications match the current filter to export.');
      return;
    }

    const headers = [
      'Application ID', 'Timestamp', 'Status', 'Full Name', 'Position', 'State',
      'District', 'Taluk', 'Mobile', 'WhatsApp', 'Email', 'Work Type',
      'Experience', 'Years', 'Previous Media', 'Education', 'Own Camera', 'Notes'
    ];

    const rows = filteredApps.map(a => [
      `"${a.applicationId || ''}"`,
      `"${a.timestamp ? new Date(a.timestamp).toLocaleString() : ''}"`,
      `"${a.applicationStatus || 'New'}"`,
      `"${(a.fullName || '').replace(/"/g, '""')}"`,
      `"${a.positionAppliedFor || ''}"`,
      `"${a.state || ''}"`,
      `"${a.district || ''}"`,
      `"${a.taluk || ''}"`,
      `"${a.mobileNumber || ''}"`,
      `"${a.whatsAppNumber || a.mobileNumber || ''}"`,
      `"${a.email || ''}"`,
      `"${a.workType || ''}"`,
      `"${a.journalismExperience || ''}"`,
      `"${a.experienceYears || '0'}"`,
      `"${(a.previousOrganisation || '').replace(/"/g, '""')}"`,
      `"${a.educationalQualification || ''}"`,
      `"${a.cameraAvailability || ''}"`,
      `"${(a.recruitmentNotes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `UVN_Recruitment_Live_Applications_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const availableDistricts = filters.state ? getDistrictsForState(filters.state) : [];

  return (
    <div className="admin-container">
      {/* Top Admin Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 24,
        background: '#ffffff',
        padding: '16px 20px',
        borderRadius: 12,
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            background: 'var(--color-primary-soft)',
            color: 'var(--color-primary-red)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-ink)' }}>
              Editorial Recruitment Board
            </h1>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Connected to: <strong>Google Sheets Database</strong> | Logged in as: <strong>{currentUser.name}</strong>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={loadData}
            disabled={loading}
            title="Fetch latest applications from Google Sheets"
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            <span>{loading ? 'Fetching...' : 'Refresh'}</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setIsGasModalOpen(true)}
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
          >
            <Cloud size={15} color="var(--color-primary-red)" />
            <span>Google Sheets Sync</span>
          </button>

          <button
            type="button"
            className="btn btn-gold"
            onClick={handleExportCSV}
            disabled={loading || applications.length === 0}
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onLogout}
            style={{ padding: '8px 14px', fontSize: '0.85rem', color: 'var(--color-danger)' }}
          >
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Backend Error Alert Banner */}
      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fca5a5',
          borderRadius: 12,
          padding: '16px 20px',
          marginBottom: 24,
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <AlertTriangle size={24} color="#dc2626" style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#991b1b', marginBottom: 4 }}>
                Unable to load live recruitment data from Google Sheets
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#7f1d1d', lineHeight: 1.5, marginBottom: 12 }}>
                {error}
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={loadData}
                  style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                >
                  <RefreshCw size={14} />
                  <span>Retry Connection</span>
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsGasModalOpen(true)}
                  style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                >
                  <Cloud size={14} />
                  <span>Verify Web App Settings</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards Overview (Derived strictly from live records) */}
      <KPICards applications={applications} currentLang={currentLang} />

      {/* Filter and Search Bar */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--color-border)',
        borderRadius: 12,
        padding: '18px 20px',
        marginBottom: 20,
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          {/* Search Box */}
          <div style={{ gridColumn: 'span 2' }}>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Search by Name / ID / Mobile / Email</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: 36 }}
                placeholder="Search live candidates..."
                value={filters.searchQuery}
                onChange={(e) => {
                  setFilters({ ...filters, searchQuery: e.target.value });
                  setCurrentPage(1);
                }}
              />
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 12 }} />
            </div>
          </div>

          {/* State Filter */}
          <div>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>State / Region</label>
            <select
              className="form-select"
              value={filters.state}
              onChange={(e) => {
                setFilters({ ...filters, state: e.target.value, district: '' });
                setCurrentPage(1);
              }}
            >
              <option value="">All Regions</option>
              {LOCATION_MASTER_DATA.map((s) => (
                <option key={s.id} value={s.nameEn}>{s.nameEn}</option>
              ))}
            </select>
          </div>

          {/* District Filter */}
          <div>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>District</label>
            <select
              className="form-select"
              value={filters.district}
              onChange={(e) => {
                setFilters({ ...filters, district: e.target.value });
                setCurrentPage(1);
              }}
            >
              <option value="">All Districts</option>
              {availableDistricts.map((d) => (
                <option key={d.id} value={d.nameEn}>{d.nameEn}</option>
              ))}
            </select>
          </div>

          {/* Position Filter */}
          <div>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Position</label>
            <select
              className="form-select"
              value={filters.position}
              onChange={(e) => {
                setFilters({ ...filters, position: e.target.value });
                setCurrentPage(1);
              }}
            >
              <option value="">All Positions</option>
              <option value="Reporter">Reporter (செய்தியாளர்)</option>
              <option value="Photojournalist">Photojournalist (புகைப்பட செய்தியாளர்)</option>
              <option value="Video Journalist">Video Journalist (வீடியோ செய்தியாளர்)</option>
            </select>
          </div>

          {/* Experience Filter */}
          <div>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Experience</label>
            <select
              className="form-select"
              value={filters.experience}
              onChange={(e) => {
                setFilters({ ...filters, experience: e.target.value });
                setCurrentPage(1);
              }}
            >
              <option value="">All Backgrounds</option>
              <option value="Experienced">Experienced (முன் அனுபவம் உள்ளவர்)</option>
              <option value="Fresher">Fresher (புதியவர்)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Application Status</label>
            <select
              className="form-select"
              value={filters.status}
              onChange={(e) => {
                setFilters({ ...filters, status: e.target.value });
                setCurrentPage(1);
              }}
            >
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Filter Summary */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Showing <strong>{filteredApps.length}</strong> of <strong>{applications.length}</strong> live applications
          </div>

          {(filters.searchQuery || filters.state || filters.district || filters.position || filters.experience || filters.status) && (
            <button
              type="button"
              onClick={() => {
                setFilters({
                  searchQuery: '',
                  state: '',
                  district: '',
                  taluk: '',
                  position: '',
                  experience: '',
                  status: '',
                  workType: ''
                });
                setCurrentPage(1);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-primary-red)',
                fontSize: '0.825rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* Applications Table */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--color-border)',
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--color-border)', color: '#475569', fontSize: '0.775rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '14px 16px' }}>Application ID</th>
                <th style={{ padding: '14px 16px' }}>Date</th>
                <th style={{ padding: '14px 16px' }}>Candidate Name</th>
                <th style={{ padding: '14px 16px' }}>Position</th>
                <th style={{ padding: '14px 16px' }}>District / Taluk</th>
                <th style={{ padding: '14px 16px' }}>Experience</th>
                <th style={{ padding: '14px 16px' }}>Status</th>
                <th style={{ padding: '14px 16px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ padding: '50px 20px', textAlign: 'center', color: '#64748b' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                      <Loader2 size={28} className="animate-spin" color="var(--color-primary-red)" />
                      <span style={{ fontWeight: 600 }}>Loading live recruitment records from Google Sheets...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedApps.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '48px 20px', textAlign: 'center', color: '#64748b' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      <Inbox size={32} color="#94a3b8" />
                      <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                        {error ? 'Unable to display records due to connection error.' : 'No applications found in the Google Sheets database.'}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        {error ? 'Check Google Apps Script Web App authorization above.' : 'New submissions from the public recruitment form will appear here automatically.'}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedApps.map((app) => (
                  <tr
                    key={app.id || app.applicationId}
                    style={{ borderBottom: '1px solid var(--color-border)', transition: 'background-color 0.15s ease' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fafafa'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-primary-red)' }}>
                      {app.applicationId}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b' }}>
                      {app.timestamp ? new Date(app.timestamp).toLocaleDateString() : '—'}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-ink)' }}>
                      <div>{app.fullName}</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 400, color: '#64748b' }}>{app.mobileNumber}</div>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                      {app.positionAppliedFor}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div>{app.district}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{app.taluk}</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {String(app.journalismExperience || '').toLowerCase() === 'yes' ? (
                        <span style={{ color: '#047857', fontWeight: 600, fontSize: '0.85rem' }}>
                          {app.experienceYears} Years
                        </span>
                      ) : (
                        <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Fresher</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={`status-pill status-${(app.applicationStatus || 'New').replace(/\s+/g, '')}`}>
                        {app.applicationStatus || 'New'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setSelectedApp(app)}
                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      >
                        <Eye size={14} />
                        <span>Review</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {!loading && paginatedApps.length > 0 && (
          <div style={{
            padding: '14px 20px',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#fafafa'
          }}>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                <ChevronLeft size={16} />
                <span>Prev</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Application Detail Modal */}
      {selectedApp && (
        <ApplicationDetailModal
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onRemove={async () => {
            setSelectedApp(null);
            await loadData();
          }}
          onUpdate={async () => {
            // Re-fetch live data from Google Sheets and keep modal state in sync
            try {
              const freshData = await ApiService.getApplications(undefined, currentUser.token);
              setApplications(freshData);
              const updated = freshData.find(a => a.applicationId === selectedApp.applicationId);
              if (updated) {
                setSelectedApp(updated);
              } else {
                setSelectedApp(null);
              }
            } catch (err) {
              await loadData();
            }
          }}
          currentLang={currentLang}
        />
      )}

      {/* Google Apps Script Sync Config Modal */}
      <GASConfigModal
        isOpen={isGasModalOpen}
        onClose={() => {
          setIsGasModalOpen(false);
          loadData();
        }}
        currentLang={currentLang}
      />
    </div>
  );
};
