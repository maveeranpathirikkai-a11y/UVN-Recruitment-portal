import React from 'react';
import { ApplicationRecord, Language } from '../../types';
import { Users, Newspaper, Camera, Video, Clock, Award, MapPin } from 'lucide-react';

interface KPICardsProps {
  applications: ApplicationRecord[];
  currentLang: Language;
}

export const KPICards: React.FC<KPICardsProps> = ({ applications, currentLang }) => {
  const total = applications.length;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayCount = applications.filter(a => a.timestamp && String(a.timestamp).startsWith(todayStr)).length;

  const reporters = applications.filter(a => (a.position || a.positionAppliedFor) === 'Reporter').length;
  const photojournalists = applications.filter(a => (a.position || a.positionAppliedFor) === 'Photojournalist').length;
  const videoJournalists = applications.filter(a => (a.position || a.positionAppliedFor) === 'Video Journalist').length;

  const fullTime = applications.filter(a => (a.workType || 'Full-time') === 'Full-time').length;
  const partTime = applications.filter(a => a.workType === 'Part-time').length;

  const experienced = applications.filter(a => String(a.experience || a.journalismExperience || '').toLowerCase() === 'yes').length;
  const freshers = applications.filter(a => String(a.experience || a.journalismExperience || '').toLowerCase() !== 'yes').length;

  // District-wise distribution
  const districtCounts: Record<string, number> = {};
  applications.forEach(a => {
    if (a.district) {
      districtCounts[a.district] = (districtCounts[a.district] || 0) + 1;
    }
  });
  const uniqueDistricts = Object.keys(districtCounts).length;
  const topDistrictsStr = Object.entries(districtCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([dist, cnt]) => `${dist} (${cnt})`)
    .join(', ');

  const cards = [
    {
      title: currentLang === 'ta' ? 'மொத்த விண்ணப்பங்கள்' : 'Total Applications',
      value: total,
      sub: `${todayCount} ${currentLang === 'ta' ? 'இன்று பெறப்பட்டவை' : 'today'}`,
      icon: <Users size={22} color="var(--color-primary-red)" />,
      bg: '#fef2f2'
    },
    {
      title: currentLang === 'ta' ? 'செய்தியாளர்கள்' : 'Reporters',
      value: reporters,
      sub: total > 0 ? `${Math.round((reporters / total) * 100)}% of total` : '0%',
      icon: <Newspaper size={22} color="#b45309" />,
      bg: '#fef3c7'
    },
    {
      title: currentLang === 'ta' ? 'புகைப்படக் கலைஞர்கள்' : 'Photojournalists',
      value: photojournalists,
      sub: total > 0 ? `${Math.round((photojournalists / total) * 100)}% of total` : '0%',
      icon: <Camera size={22} color="#15803d" />,
      bg: '#f0fdf4'
    },
    {
      title: currentLang === 'ta' ? 'வீடியோ செய்தியாளர்கள்' : 'Video Journalists',
      value: videoJournalists,
      sub: total > 0 ? `${Math.round((videoJournalists / total) * 100)}% of total` : '0%',
      icon: <Video size={22} color="#4338ca" />,
      bg: '#e0e7ff'
    },
    {
      title: currentLang === 'ta' ? 'முழு நேரம் / பகுதி நேரம்' : 'Full-time / Part-time',
      value: `${fullTime} / ${partTime}`,
      sub: 'Work type split',
      icon: <Clock size={22} color="#0e7490" />,
      bg: '#ecfeff'
    },
    {
      title: currentLang === 'ta' ? 'அனுபவம் / புதியவர்' : 'Experienced / Freshers',
      value: `${experienced} / ${freshers}`,
      sub: 'Journalism background',
      icon: <Award size={22} color="#7e22ce" />,
      bg: '#f3e8ff'
    },
    {
      title: currentLang === 'ta' ? 'மாவட்ட வாரியான பங்களிப்பு' : 'District-wise Totals',
      value: `${uniqueDistricts} ${currentLang === 'ta' ? 'மாவட்டங்கள்' : 'Districts'}`,
      sub: topDistrictsStr || (currentLang === 'ta' ? 'தகவல் இல்லை' : 'No records yet'),
      icon: <MapPin size={22} color="#059669" />,
      bg: '#ecfdf5'
    }
  ];

  return (
    <div className="kpi-grid">
      {cards.map((c, idx) => (
        <div key={idx} className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: c.bg }}>
            {c.icon}
          </div>
          <div>
            <div className="kpi-value">{c.value}</div>
            <div className="kpi-label">{c.title}</div>
            <div style={{ fontSize: '0.725rem', color: '#64748b', marginTop: 2 }}>{c.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
