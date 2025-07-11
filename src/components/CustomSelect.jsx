import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CustomSelect = ({
  options,
  value,
  onChange,
  position = "top",
  className = "",
  "aria-label": ariaLabel = "Currency selector",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(value);
  const selectRef = useRef(null);
  const buttonRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Only handle keyboard events when select or its options are focused
      if (!selectRef.current?.contains(document.activeElement)) return;

      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleOptionClick = (option) => {
    setSelected(option);
    onChange(option);
    setIsOpen(false);
  };

  const handleKeyPress = (event, option) => {
    // Only handle Enter/Space when the option itself is focused
    if (document.activeElement === event.target && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      handleOptionClick(option);
    }
  };

  // Update selected when value changes from parent
  useEffect(() => {
    setSelected(value);
  }, [value]);

  return (
    <div className={`relative min-w-20 ${className}`} ref={selectRef}>
      {/* Select Button */}
      <button
        ref={buttonRef}
        className="flex items-center justify-center px-4 py-2 min-w-32 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          // Only handle Enter/Space when button is focused
          if (document.activeElement === buttonRef.current && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        style={{ boxShadow: "none" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selected.value}
            className="flex items-center gap-2"
            initial={{ y: position === "top" ? -10 : 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: position === "top" ? 10 : -10, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <span className="text-base text-black dark:text-white">
              {selected.symbol}
            </span>
            <span className="text-base font-medium text-black dark:text-white">
              {selected.label}
            </span>
          </motion.div>
        </AnimatePresence>
        <motion.svg
          className="ml-2 w-4 h-4 text-gray-500 dark:text-gray-400"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </button>

      {/* Animated Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute min-w-32 left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-[#a0e870] rounded-2xl shadow-lg z-50 overflow-hidden pt-1 pb-1"
            role="listbox"
          >
            <div className="max-h-48 overflow-y-auto overflow-x-hidden">
              {options.map((option) => (
                <motion.div
                  key={option.value}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-center justify-center gap-2 px-4 py-3 cursor-pointer transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white mx-2 my-1 rounded-xl focus:outline-none ${
                    selected.value === option.value
                      ? "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
                      : "text-black dark:text-gray-300"
                  }`}
                  onClick={() => handleOptionClick(option)}
                  onKeyDown={(e) => handleKeyPress(e, option)}
                  tabIndex={0}
                  role="option"
                  aria-selected={selected.value === option.value}
                  style={{ boxShadow: "none" }}
                >
                  <span className="text-base">{option.symbol}</span>
                  <span className="text-base font-medium">{option.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomSelect;
