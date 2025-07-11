export const APP_NAME = 'CCurrency';

export const ANIMATION_DURATION = {
  FAST: 0.2,
  MEDIUM: 0.3,
  SLOW: 0.5
};

export const DEBOUNCE_DELAY = 300;

export const API_TIMEOUT = 10000;

export const STORAGE_KEYS = {
  DARK_MODE: 'darkMode',
  EXCHANGE_RATES: 'lastExchangeRates',
  LAST_CURRENCIES: 'lastSelectedCurrencies'
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  API_ERROR: 'Unable to fetch exchange rates. Please try again.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',
  INVALID_AMOUNT: 'Please enter a valid amount.',
  OFFLINE_MODE: 'Using cached exchange rate (offline mode)'
}; 