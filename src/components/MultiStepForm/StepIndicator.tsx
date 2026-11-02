import React from 'react';
import { Language } from '../../types';
import { TRANSLATIONS } from '../../data/translations';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  currentLang: Language;
  onStepClick?: (step: number) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  currentLang,
  onStepClick
}) => {
  const t = TRANSLATIONS[currentLang];

  const steps = [
    { num: 1, title: t.step1Title },
    { num: 2, title: t.step2Title },
    { num: 3, title: t.step3Title },
    { num: 4, title: t.step4Title },
    { num: 5, title: t.step5Title },
    { num: 6, title: t.step6Title },
  ];

  return (
    <nav className="step-nav" aria-label="Recruitment form progress">
      {steps.map((step) => {
        const isCompleted = step.num < currentStep;
        const isActive = step.num === currentStep;

        return (
          <div
            key={step.num}
            className={`step-nav-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
            onClick={() => {
              if (isCompleted && onStepClick) {
                onStepClick(step.num);
              }
            }}
            style={{ cursor: isCompleted ? 'pointer' : 'default' }}
            title={isCompleted ? `Go back to Step ${step.num}` : undefined}
          >
            <div className="step-nav-circle">
              {isCompleted ? <Check size={18} strokeWidth={2.5} /> : step.num}
            </div>
            <div className="step-nav-title">{step.title}</div>
          </div>
        );
      })}
    </nav>
  );
};
