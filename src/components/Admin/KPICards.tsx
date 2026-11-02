import React from 'react';
import { ApplicationRecord, Language } from '../../types';
import { Users, Calendar, Newspaper, Camera, Video, Clock, Award, Sparkles } from 'lucide-react';

interface KPICardsProps {
  applications: ApplicationRecord[];
  currentLang: Language;
}

export const KPICards: React.FC<KPICardsProps> = ({ applications, currentLang }) => {
  const total = applications.length;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayCount = applications.filter(a => a.timestamp && a.timestamp.startsWith(todayStr)).length;

  const reporters = applications.filter(a => a.positionAppliedFor === 'Reporter').length;
  const photojournalists = applications.filter(a => a.positionAppliedFor === 'Photojournalist').length;
  const videoJournalists = applications.filter(a => a.positionAppliedFor === 'Video Journalist').length;

  const fullTime = applications.filter(a => a.workType === 'Full-time').length;
  const partTime = applications.filter(a => a.workType === 'Part-time').length;

  const experienced = applications.filter(a => a.journalismExperience === 'Yes').length;
  const freshers = applications.filter(a => a.journalismExperience === 'No').length;

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
      sub: `${Math.round((reporters / (total || 1)) * 100)}% of total`,
      icon: <Newspaper size={22} color="#b45309" />,
      bg: '#fef3c7'
    },
    {
      title: currentLang === 'ta' ? 'புகைப்படக் கலைஞர்கள்' : 'Photojournalists',
      value: photojournalists,
      sub: `${Math.round((photojournalists / (total || 1)) * 100)}% of total`,
      icon: <Camera size={22} color="#15803d" />,
      bg: '#f0fdf4'
    },
    {
      title: currentLang === 'ta' ? 'வீடியோ செய்தியாளர்கள்' : 'Video Journalists',
      value: videoJournalists,
      sub: `${Math.round((videoJournalists / (total || 1)) * 100)}% of total`,
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
