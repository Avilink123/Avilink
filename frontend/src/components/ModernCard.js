import React from 'react';

const ModernCard = ({ 
  children, 
  backgroundImage, 
  gradient = false, 
  className = '', 
  onClick,
  style = {} 
}) => {
  const baseClasses = "bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg";
  
  const cardStyle = {
    ...style,
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  const overlayClasses = gradient 
    ? "bg-gradient-to-t from-green-700/80 via-green-600/60 to-transparent h-full w-full p-6 flex flex-col justify-end text-white"
    : backgroundImage 
      ? "bg-black/20 h-full w-full p-6 flex flex-col justify-end text-white"
      : "p-6";

  if (onClick) {
    return (
      <div 
        className={`${baseClasses} cursor-pointer hover:scale-105 ${className}`}
        style={cardStyle}
        onClick={onClick}
      >
        {backgroundImage ? (
          <div className={overlayClasses}>
            {children}
          </div>
        ) : (
          <div className={overlayClasses}>
            {children}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`${baseClasses} ${className}`} style={cardStyle}>
      {backgroundImage ? (
        <div className={overlayClasses}>
          {children}
        </div>
      ) : (
        <div className={overlayClasses}>
          {children}
        </div>
      )}
    </div>
  );
};

export default ModernCard;