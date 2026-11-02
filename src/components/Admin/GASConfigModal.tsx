import React, { useState } from 'react';
import { ApiService } from '../../services/api';
import { Language } from '../../types';
import { Cloud, CheckCircle, AlertTriangle, Loader2, X, ExternalLink, Save } from 'lucide-react';

interface GASConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
}

export const GASConfigModal: React.FC<GASConfigModalProps> = ({ isOpen, onClose, currentLang }) => {
  const [url, setUrl] = useState<string>(ApiService.getGasUrl());
  const [testing, setTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    const res = await ApiService.testGasConnection(url);
    setTesting(false);
    setTestResult(res);
  };

  const handleSave = () => {
    ApiService.setGasUrl(url);
    alert('Google Apps Script configuration saved successfully.');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Cloud size={24} color="var(--color-primary-red)" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary-red)' }}>
              Google Sheets & Apps Script Integration
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          >
            <X size={20} color="#64748b" />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: 16 }}>
            Every application submitted through this portal can sync in real-time to your Google Spreadsheet
            and Google Drive folder. Paste your deployed Google Apps Script Web App URL below.
          </p>

          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="form-label" htmlFor="gas-url-input">
              <span>Google Apps Script Web App URL</span>
            </label>
            <input
              id="gas-url-input"
              type="url"
              className="form-input"
              placeholder="https://script.google.com/macros/s/AKfycb.../exec"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <span className="help-text">
              Must be deployed as Web App with <strong>Who has access: Anyone</strong>.
            </span>
          </div>

          {testResult && (
            <div style={{
              padding: '12px 16px',
              borderRadius: 8,
              background: testResult.success ? '#f0fdf4' : '#fef2f2',
              border: `1px solid ${testResult.success ? '#86efac' : '#fca5a5'}`,
              color: testResult.success ? '#166534' : '#991b1b',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 16
            }}>
              {testResult.success ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
              <span>{testResult.message}</span>
            </div>
          )}

          <div style={{
            background: '#f8fafc',
            border: '1px solid var(--color-border)',
            borderRadius: 8,
            padding: 14,
            fontSize: '0.825rem',
            color: '#334155',
            marginBottom: 20
          }}>
            <strong>Setup Checklist (Google Apps Script):</strong>
            <ol style={{ paddingLeft: 20, marginTop: 6, lineHeight: 1.6 }}>
              <li>Open <code>script.google.com</code> and paste <code>Code.gs</code> and <code>SetupSpreadsheet.gs</code>.</li>
              <li>Run <code>setupRecruitmentDatabase()</code> to create all 4 tabs & Drive folder.</li>
              <li>Deploy as Web App (Execute as: Me, Access: Anyone).</li>
              <li>Paste URL here and click "Test Connection".</li>
            </ol>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleTest}
              disabled={testing || !url.trim()}
            >
              {testing ? <Loader2 size={16} className="animate-spin" /> : null}
              <span>Test Connection</span>
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
            >
              <Save size={16} />
              <span>Save Configuration</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
