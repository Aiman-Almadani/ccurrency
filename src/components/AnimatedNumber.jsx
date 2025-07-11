import React from 'react';
import { useCountUp } from '../hooks/useCountUp';

const AnimatedNumber = ({ 
  value, 
  duration = 0.2,
  className = "",
  decimals = 2
}) => {
  const numericValue = parseFloat(value) || 0;
  const animatedValue = useCountUp(numericValue, duration);
  
  return (
    <span className={`tabular-nums text-black dark:text-white ${className}`}>
      {animatedValue.toFixed(decimals)}
    </span>
  );
};

export default AnimatedNumber; 