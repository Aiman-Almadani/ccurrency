import { useState, useEffect, useCallback } from 'react';
import { currencyService } from '../services/currencyService';
import { useLocalStorage } from './useLocalStorage';

export const useCurrencyConverter = (amount, fromCurrency, toCurrency) => {
  const [convertedAmount, setConvertedAmount] = useState('0.00');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastRates, setLastRates] = useLocalStorage('lastExchangeRates', {});
  const [apiStatus, setApiStatus] = useState({ online: true, lastUpdate: null });

  const convertCurrency = useCallback(async () => {
    // Handle empty or invalid inputs
    if (!amount || amount === '0' || !fromCurrency || !toCurrency) {
      setConvertedAmount('0.00');
      setError(null);
      return;
    }

    // Handle same currency conversion
    if (fromCurrency.value === toCurrency.value) {
      setConvertedAmount(parseFloat(amount).toFixed(2));
      setError(null);
      return;
    }

    // Validate amount is a valid number
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setConvertedAmount('0.00');
      setError('Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await currencyService.convert(numericAmount, fromCurrency.value, toCurrency.value);
      
      if (result && !isNaN(result) && result > 0) {
        setConvertedAmount(result.toFixed(2));
        setApiStatus({ online: true, lastUpdate: new Date().toISOString() });
        
        // Cache the exchange rate for offline use
        const rateKey = `${fromCurrency.value}-${toCurrency.value}`;
        setLastRates(prev => ({
          ...prev,
          [rateKey]: result / numericAmount,
          lastUpdated: new Date().toISOString()
        }));
      } else {
        throw new Error('Invalid conversion result');
      }
    } catch (err) {
      console.error('Currency conversion failed:', err);
      
      // Try to use cached rate as fallback
      const rateKey = `${fromCurrency.value}-${toCurrency.value}`;
      const cachedRate = lastRates[rateKey];
      const lastUpdated = lastRates.lastUpdated;
      
      if (cachedRate && !isNaN(cachedRate)) {
        const fallbackResult = numericAmount * cachedRate;
        setConvertedAmount(fallbackResult.toFixed(2));
        
        // Format the time difference
        const timeDiff = lastUpdated ? getTimeDifference(new Date(lastUpdated)) : 'unknown time';
        setError(`Using cached rates from ${timeDiff} ago (offline mode)`);
        setApiStatus({ online: false, lastUpdate: lastUpdated });
      } else {
        setConvertedAmount('0.00');
        setApiStatus({ online: false, lastUpdate: null });
        
        // Provide user-friendly error messages
        if (err.message.includes('All currency APIs failed')) {
          setError('Unable to fetch current rates. Please check your internet connection.');
        } else if (err.message.includes('timeout')) {
          setError('Request timed out. Please try again.');
        } else if (err.message.includes('404')) {
          setError('Currency conversion service unavailable. Please try again later.');
        } else if (err.message.includes('429')) {
          setError('Rate limit exceeded. Please try again in a few minutes.');
        } else {
          setError('Unable to convert currency. Please try again.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [amount, fromCurrency, toCurrency, lastRates, setLastRates]);

  // Helper function to format time difference
  const getTimeDifference = (lastUpdate) => {
    const now = new Date();
    const diff = now - lastUpdate;
    
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    }
    
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? 's' : ''}`;
  };

  useEffect(() => {
    // Only debounce if we have valid inputs
    if (amount && fromCurrency && toCurrency) {
      const debounceTimer = setTimeout(() => {
        convertCurrency();
      }, 300); // Debounce API calls

      return () => clearTimeout(debounceTimer);
    } else {
      // Immediately set to 0.00 for invalid inputs
      setConvertedAmount('0.00');
      setError(null);
    }
  }, [convertCurrency, amount, fromCurrency, toCurrency]);

  return {
    convertedAmount,
    isLoading,
    error,
    apiStatus,
    retry: convertCurrency
  };
}; 