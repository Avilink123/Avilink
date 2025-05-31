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
    position: 'relative',
  };

  const overlayClasses = gradient && backgroundImage
    ? "absolute inset-0 bg-gradient-to-t from-green-700/80 via-green-600/60 to-transparent"
    : backgroundImage 
      ? "absolute inset-0 bg-black/20"
      : "";

  const contentClasses = backgroundImage 
    ? "relative z-10 p-6 h-full flex flex-col justify-end"
    : "p-6";

  const CardComponent = onClick ? 'button' : 'div';
  const cardProps = onClick ? {
    onClick,
    className: `${baseClasses} cursor-pointer hover:scale-105 transition-transform w-full text-left ${className}`,
    style: cardStyle
  } : {
    className: `${baseClasses} ${className}`,
    style: cardStyle
  };

  return React.createElement(CardComponent, cardProps, [
    backgroundImage && React.createElement('div', { 
      key: 'overlay', 
      className: overlayClasses 
    }),
    React.createElement('div', { 
      key: 'content', 
      className: contentClasses 
    }, children)
  ]);
};

export default ModernCard;