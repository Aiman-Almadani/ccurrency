import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';

// Components
import Card from './components/Card';
import Input from './components/Input';
import CustomSelect from './components/CustomSelect';
import SwapButton from './components/SwapButton';
import AnimatedNumber from './components/AnimatedNumber';
import DarkModeToggle from './components/DarkModeToggle';

// Hooks
import { useCurrencyConverter } from './hooks/useCurrencyConverter';
import { useLocalStorage } from './hooks/useLocalStorage';

// Services
import { currencyService } from './services/currencyService';

// Utils
import { APP_NAME } from './utils/constants';

export default function App() {
  // Get supported currencies from service
  const currencyOptions = currencyService.getSupportedCurrencies();
  
  // Get default currencies from options
  const defaultFromCurrency = currencyOptions.find(c => c.value === "USD") || currencyOptions[0];
  const defaultToCurrency = currencyOptions.find(c => c.value === "EUR") || currencyOptions[1];
  
  // State management with proper initial values
  const [amount, setAmount] = useState("1");
  const [fromCurrency, setFromCurrency] = useLocalStorage('lastFromCurrency', defaultFromCurrency);
  const [toCurrency, setToCurrency] = useLocalStorage('lastToCurrency', defaultToCurrency);
  const [isCopied, setIsCopied] = useState(false);

  // Currency conversion hook
  const { convertedAmount, isLoading, error } = useCurrencyConverter(
    amount,
    fromCurrency,
    toCurrency
  );

  // Available currencies for each dropdown
  const getAvailableOptions = (excludeCurrency) => {
    return currencyOptions.filter(
      (option) => option.value !== excludeCurrency?.value
    );
  };

  // Handle currency swap
  const handleSwap = (e) => {
    e.preventDefault(); // Prevent form submission
    const tempCurrency = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(tempCurrency);
  };

  // Handle copy to clipboard
  const handleValueCopy = async (e) => {
    e.preventDefault(); // Prevent form submission
    try {
      await navigator.clipboard.writeText(convertedAmount);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 600);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  // Handle form submission (prevent default)
  const handleSubmit = (e) => {
    e.preventDefault();
    // Do nothing - just prevent form submission
  };

  return (
    <div className="bg-zinc-100 dark:bg-gray-900 min-h-screen flex items-center justify-center transition-colors duration-200">
      <div className="max-w-screen-md mx-auto mt-10 flex flex-col items-center gap-2 px-4">
        {/* Header with Dark Mode Toggle */}
        <div className="flex items-center justify-between w-full mb-4">
          <h1 className="text-4xl font-medium text-black dark:text-white transition-colors duration-200">
            {APP_NAME}
          </h1>
          <DarkModeToggle />
        </div>

        {/* Main Converter Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="p-2 rounded-3xl flex flex-col gap-3 border-2 border-gray-200 dark:border-gray-700 shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-200">
            
            {/* Amount Input Card */}
            <Card>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Amount</p>
              <div className="flex items-end gap-2">
                <div className="flex items-center gap-1 min-w-4 pb-1">
                  <span className="text-gray-500 dark:text-gray-400">{fromCurrency.symbol}</span>
                </div>
                <div className="flex-1">
                  <Input
                    value={amount}
                    onChange={setAmount}
                    aria-label="Amount to convert"
                    autoFocus={true}
                  />
                </div>
                <CustomSelect
                  options={getAvailableOptions(toCurrency)}
                  value={fromCurrency}
                  onChange={setFromCurrency}
                  position="top"
                  aria-label="From currency"
                />
              </div>
            </Card>

            {/* Converted Amount Card */}
            <Card>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Converted to</p>
              <div className="flex items-end gap-2">
                <div className="flex items-center gap-1 min-w-4 pb-1">
                  <span className="text-gray-500 dark:text-gray-400">{toCurrency.symbol}</span>
                </div>
                <div 
                  onClick={handleValueCopy}
                  className="flex-1 bg-transparent outline-none text-2xl font-medium cursor-pointer m-0 p-0 text-black dark:text-white transition-colors duration-200 hover:text-[#a0e870] dark:hover:text-[#a0e870]"
                  role="button"
                  tabIndex={0}
                  aria-label="Click to copy converted amount"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleValueCopy(e);
                    }
                  }}
                >
                  <AnimatedNumber value={convertedAmount || "0.00"} />
                </div>
                <CustomSelect
                  options={getAvailableOptions(fromCurrency)}
                  value={toCurrency}
                  onChange={setToCurrency}
                  position="bottom"
                  aria-label="To currency"
                />
              </div>
            </Card>

            {/* Swap Button */}
            <SwapButton
              onClick={handleSwap}
              isLoading={isLoading}
              isCopied={isCopied}
              aria-label="Swap currencies"
            />
          </div>
        </form>

        {/* Error Message - Outside main card */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full max-w-md mt-4 px-4 py-3 bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded-2xl text-sm text-yellow-800 dark:text-yellow-200 shadow-lg"
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span>{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Real-time exchange rates • Tap converted amount to copy</p>
        </div>
      </div>
    </div>
  );
}
