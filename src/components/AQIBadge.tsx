import React from 'react';
import { AQICategory } from '../types';
import { getAQICategory, getAQIColor, getAQIBadgeShape } from '../services/aqiService';
import { ShieldCheck, AlertCircle, AlertTriangle, Octagon, Hexagon, Skull } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

interface AQIBadgeProps {
  aqi: number;
  category?: AQICategory;
  showShapeName?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const AQIBadge: React.FC<AQIBadgeProps> = ({
  aqi,
  category: propCategory,
  showShapeName = false,
  size = 'md',
}) => {
  const { colorblindFriendly } = useAccessibility();
  const category = propCategory || getAQICategory(aqi);
  const colorClass = getAQIColor(category);
  const shapeName = getAQIBadgeShape(category);

  const getShapeIcon = () => {
    switch (category) {
      case 'Good':
        return <ShieldCheck className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'} />;
      case 'Moderate':
        return <AlertCircle className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'} />;
      case 'Poor':
        return <AlertTriangle className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'} />;
      case 'Unhealthy':
        return <Octagon className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'} />;
      case 'Severe':
        return <Hexagon className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'} />;
      case 'Hazardous':
        return <Skull className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'} />;
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-base px-3.5 py-1.5 gap-2 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-mono font-medium transition-all ${colorClass} ${sizeClasses[size]}`}
      title={`AQI ${aqi} - Category: ${category} (${shapeName})`}
      role="status"
      aria-label={`Air Quality Index: ${aqi}, Category: ${category}`}
    >
      {getShapeIcon()}
      <span>{aqi}</span>
      <span className="font-sans font-medium text-xs opacity-90">({category})</span>
      {colorblindFriendly || showShapeName ? (
        <span className="text-[10px] font-sans uppercase tracking-wider opacity-75 border-l border-current/30 pl-1.5 ml-0.5">
          {shapeName.split(' ')[0]}
        </span>
      ) : null}
    </span>
  );
};
