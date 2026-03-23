import React from 'react';

// TypeScript interface for props
interface SkillBadgeProps {
  label: string;
  color?: string;  // optional — defaults to teal
}

// Colour map: skill name → background colour
const colorMap: Record<string, string> = {
  React:       '#0D9488',
  TypeScript:  '#3B82F6',
  JavaScript:  '#F59E0B',
  'Node.js':   '#22C55E',
  CSS:         '#A855F7',
  'CSS Modules':'#7C3AED',
  Vite:        '#646CFF',
  Figma:       '#EF4444',
  Tailwind:    '#06B6D4',
  Docker:      '#2563EB',
  Storybook:   '#FF4785',
  PostgreSQL:  '#336791',
};

const SkillBadge = ({ label, color }: SkillBadgeProps) => {
  // Inline style: dynamic background from colorMap or prop
  const style: React.CSSProperties = {
    backgroundColor: color ?? colorMap[label] ?? '#0D9488',
    color: '#ffffff',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '0.78rem',
    fontWeight: 600,
    display: 'inline-block',
    margin: '3px',
    letterSpacing: '0.02em',
  };

  return <span style={style}>{label}</span>;
};

export default SkillBadge;
