import React from 'react';

const Card = ({ children, className = "" }) => {
  return (
    <div className={`flex flex-col gap-4 p-4 rounded-2xl bg-white dark:bg-gray-800 transition-colors duration-200 ${className}`}>
      {children}
    </div>
  );
};

export default Card; 