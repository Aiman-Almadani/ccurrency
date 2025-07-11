import React, { useRef, useEffect } from 'react';

const Input = ({ 
  value, 
  onChange, 
  placeholder = "0", 
  readonly = false,
  className = "",
  'aria-label': ariaLabel = "Amount input",
  autoFocus = true
}) => {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    // Only allow numbers and decimal point
    const val = e.target.value.replace(/[^0-9.]/g, "");
    // Prevent multiple decimal points
    if (val.split(".").length > 2) return;
    onChange(val);
  };

  // Focus management
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }

    const handleKeyDown = (e) => {
      // Focus input when Enter is pressed (but not if already focused)
      if (e.key === 'Enter' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select(); // Select all text for easy replacement
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [autoFocus]);

  return (
    <div className="rounded-md select-none">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        readOnly={readonly}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className={`w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:border-none text-2xl font-medium text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${className}`}
        style={{ boxShadow: 'none' }}
      />
    </div>
  );
};

export default Input; 