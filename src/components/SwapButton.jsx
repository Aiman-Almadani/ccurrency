import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SwapButton = ({ 
  onClick, 
  isLoading = false, 
  isCopied = false,
  className = "",
  'aria-label': ariaLabel = "Swap currencies"
}) => {
  const swapRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement === swapRef.current) {
        return;
      }
      if (e.code === "Space" && !isLoading) {
        e.preventDefault();
        onClick(e);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClick, isLoading]);

  const handleClick = (e) => {
    e.preventDefault(); // Prevent form submission
    if (!isLoading) {
      onClick(e);
    }
  };

  return (
    <div className={`rounded-md select-none ${className}`}>
      <button
        ref={swapRef}
        type="button" // Explicitly set type to prevent form submission
        onClick={handleClick}
        disabled={isLoading}
        aria-label={ariaLabel}
        className="w-full min-h-18 outline-none text-2xl bg-[#a0e870] dark:bg-[#7fcf4c] py-4 rounded-2xl hover:bg-[#7fcf4c] dark:hover:bg-[#6bb83a] transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none"
        style={{ boxShadow: 'none' }}
      >
        <AnimatePresence mode="wait">
          {isCopied ? (
            <motion.div
              key="copied"
              className="flex items-center justify-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <span>✓</span>
              Copied!
            </motion.div>
          ) : isLoading ? (
            <motion.div
              key="loading"
              className="flex items-center justify-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span className="sr-only">Loading...</span>
            </motion.div>
          ) : (
            <motion.div
              key="swap"
              className="flex items-center justify-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              <span>Swap</span>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
};

export default SwapButton; 