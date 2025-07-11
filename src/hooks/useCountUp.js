import { useState, useEffect, useRef } from 'react';

export const useCountUp = (end, duration = 0.5) => {
  const [count, setCount] = useState(0);
  const previousEnd = useRef(end);

  useEffect(() => {
    let startTime;
    let animationFrame;
    const startValue = previousEnd.current;
    
    const animation = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      const currentCount = progress * (end - startValue) + startValue;
      setCount(currentCount);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animation);
      }
    };
    
    animationFrame = requestAnimationFrame(animation);
    previousEnd.current = end;
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);

  return count;
}; 