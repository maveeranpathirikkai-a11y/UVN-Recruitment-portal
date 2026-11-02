import React from 'react';
import { Language } from '../types';
import { ShieldCheck, X, Lock, CheckCircle, FileText } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
  currentLang
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 700 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShieldCheck size={24} color="var(--color-primary-red)" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary-red)' }}>
              {currentLang === 'ta' ? 'தனியுரிமைக் கொள்கை மற்றும் ஆட்சேர்ப்பு விதிமுறைகள்' : 'Privacy Policy & Terms of Application'}
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

        <div className="modal-body" style={{ fontSize: '0.925rem', lineHeight: 1.7, color: 'var(--color-ink)' }}>
          {currentLang === 'ta' ? (
            <>
              <div style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#7f1d1d', marginBottom: 6 }}>
                  1. தகவல் சேகரிப்பு & நோக்கம் (Information Collection & Purpose)
                </h3>
                <p>
                  உங்கள் விஜய் நாளிதழின் செய்தியாளர், புகைப்பட செய்தியாளர் மற்றும் வீடியோ செய்தியாளர் பணியிடங்களுக்கான ஆட்சேர்ப்புத் தேவைகளுக்காக மட்டுமே விண்ணப்பதாரரின் பெயர், தொடர்பு எண்கள், இருப்பிடம் மற்றும் தகுதிகள் பெறப்படுகின்றன.
                </p>
              </div>

              <div style={{ marginBottom: 16, background: '#fef3c7', padding: 12, borderRadius: 8, borderLeft: '4px solid #d97706' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#92400e', marginBottom: 4 }}>
                  2. கடுமையான ஆதார் & தனிநபர் தரவு பாதுகாப்பு (Aadhaar & Privacy Policy)
                </h3>
                <p style={{ color: '#78350f' }}>
                  விண்ணப்பதாரர்களின் முழுமையான ஆதார் எண் அல்லது பயோமெட்ரிக் விவரங்கள் எக்காரணத்திற்காகவும் கேட்கப்படுவதில்லை, சேகரிக்கப்படுவதில்லை. அடையாள சரிபார்ப்பிற்கு தேவைப்பட்டால் கடைசி 4 இலக்கங்கள் மட்டுமே விருப்பத்தேர்வாகப் பெறப்படும்.
                </p>
              </div>

              <div style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#7f1d1d', marginBottom: 6 }}>
                  3. தரவுப் பாதுகாப்பு & ரகசியத்தன்மை (Data Confidentiality)
                </h3>
                <p>
                  விண்ணப்பதாரரின் தனிப்பட்ட விவரங்கள் பொது வெளியில் ஒருபோதும் காட்சிப்படுத்தப்படாது. அனைத்து விண்ணப்ப விவரங்களும் அங்கீகரிக்கப்பட்ட ஆசிரியர் குழு மற்றும் நிர்வாகத்தால் மட்டுமே பரிசீலிக்கப்படும்.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#7f1d1d', marginBottom: 6 }}>
                  4. தொடர்பு மற்றும் திருத்தங்கள் (Contact & Rights)
                </h3>
                <p>
                  உங்கள் விண்ணப்ப விவரங்களை புதுப்பிக்க அல்லது நீக்க விரும்பினால், உங்கள் Application ID-ஐ குறிப்பிட்டு ஆசிரியர் குழு நிர்வாகத்தை நேரடியாக அணுகலாம்.
                </p>
              </div>
            </>
          ) : (
            <>
              <div style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#7f1d1d', marginBottom: 6 }}>
                  1. Purpose of Data Collection
                </h3>
                <p>
                  UNGAL VIJAY NAALITHAZH collects candidate information exclusively for evaluating qualifications for Reporter, Photojournalist, and Video Journalist positions across Tamil Nadu and Puducherry.
                </p>
              </div>

              <div style={{ marginBottom: 16, background: '#fef3c7', padding: 12, borderRadius: 8, borderLeft: '4px solid #d97706' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#92400e', marginBottom: 4 }}>
                  2. Strict Aadhaar and Identity Protection
                </h3>
                <p style={{ color: '#78350f' }}>
                  In full compliance with data privacy guidelines, full Aadhaar numbers and sensitive identity cards are never stored or requested. Candidates may optionally provide only the last 4 digits of their identity card for interview verification.
                </p>
              </div>

              <div style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#7f1d1d', marginBottom: 6 }}>
                  3. Data Security & Storage
                </h3>
                <p>
                  Uploaded documents are stored in private, restricted cloud repositories. Candidate information is never displayed publicly or shared with third-party advertisers.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#7f1d1d', marginBottom: 6 }}>
                  4. Editorial Contact & Data Rights
                </h3>
                <p>
                  Applicants have the right to request review, correction, or deletion of their submitted recruitment profile by quoting their unique Application ID to the recruitment board.
                </p>
              </div>
            </>
          )}
        </div>

        <div style={{ padding: '14px 24px', borderTop: '1px solid var(--color-border)', textAlign: 'right', background: '#fafafa' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onClose}
            style={{ padding: '8px 20px' }}
          >
            {currentLang === 'ta' ? 'புரிந்துகொண்டேன் / மூடுக' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
