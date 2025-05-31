import React from 'react';

const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color = '#16a34a', 
  trend,
  compact = false 
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '';
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return '#10b981';
      case 'down': return '#ef4444';
      default: return '#64748b';
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-md p-${compact ? '4' : '6'} transition-all duration-300 hover:shadow-lg`}>
      <div className="flex items-center justify-between mb-2">
        {icon && <span className="text-lg">{icon}</span>}
        <span className="text-sm font-medium text-gray-600 flex-1 ml-2">{title}</span>
        {trend && (
          <span style={{ color: getTrendColor() }} className="text-base">
            {getTrendIcon()}
          </span>
        )}
      </div>
      
      <div 
        className={`${compact ? 'text-xl' : 'text-3xl'} font-bold mb-1`}
        style={{ color }}
      >
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      
      {subtitle && (
        <div className="text-xs text-gray-500">{subtitle}</div>
      )}
    </div>
  );
};

export default StatCard;