import { apiClient } from './apiClient';

class CurrencyService {
  constructor() {
    this.endpoints = [
      {
        name: 'exchangerate.host',
        baseUrl: 'https://api.exchangerate.host',
        convert: (amount, from, to) => `/convert?from=${from}&to=${to}&amount=${amount}`,
        parseResponse: (data) => {
          if (data.success && data.result !== undefined) {
            return data.result;
          }
          if (data.rates && Object.keys(data.rates).length > 0) {
            const rate = Object.values(data.rates)[0];
            return rate;
          }
          throw new Error('Invalid response format from exchangerate.host');
        }
      },
      {
        name: 'frankfurter.app',
        baseUrl: 'https://api.frankfurter.app',
        convert: (amount, from, to) => `/latest?amount=${amount}&from=${from}&to=${to}`,
        parseResponse: (data, to) => {
          if (data.rates && data.rates[to] !== undefined) {
            return data.rates[to];
          }
          throw new Error('Invalid response format from frankfurter.app');
        }
      },
      {
        name: 'exchangerate-api',
        baseUrl: 'https://open.er-api.com/v6',
        convert: (amount, from, to) => `/latest/${from}`,
        parseResponse: (data, to, amount) => {
          if (data.rates && data.rates[to] !== undefined) {
            return amount * data.rates[to];
          }
          throw new Error('Invalid response format from exchangerate-api');
        }
      }
    ];
    this.currentEndpointIndex = 0;
    this.lastSuccessfulEndpoint = null;
  }

  async convert(amount, fromCurrency, toCurrency) {
    const errors = [];
    
    // First try the last successful endpoint if available
    if (this.lastSuccessfulEndpoint !== null) {
      try {
        const result = await this.tryEndpoint(this.endpoints[this.lastSuccessfulEndpoint], amount, fromCurrency, toCurrency);
        return result;
      } catch (error) {
        console.warn(`Last successful endpoint failed:`, error.message);
      }
    }
    
    // Try each endpoint until one succeeds
    const startIndex = this.currentEndpointIndex;
    let attemptsCount = 0;
    
    while (attemptsCount < this.endpoints.length) {
      const endpoint = this.endpoints[this.currentEndpointIndex];
      
      try {
        const result = await this.tryEndpoint(endpoint, amount, fromCurrency, toCurrency);
        this.lastSuccessfulEndpoint = this.currentEndpointIndex;
        return result;
      } catch (error) {
        console.warn(`${endpoint.name} failed:`, error.message);
        errors.push(`${endpoint.name}: ${error.message}`);
        
        // Move to next endpoint
        this.currentEndpointIndex = (this.currentEndpointIndex + 1) % this.endpoints.length;
        attemptsCount++;
      }
    }
    
    // Reset to start index if all endpoints failed
    this.currentEndpointIndex = startIndex;
    
    // If all endpoints failed, throw combined error
    throw new Error(`All currency APIs failed: ${errors.join(', ')}`);
  }

  async tryEndpoint(endpoint, amount, fromCurrency, toCurrency) {
    const url = endpoint.convert(amount, fromCurrency, toCurrency);
    const response = await apiClient.get(`${endpoint.baseUrl}${url}`);
    
    if (response.data) {
      const result = endpoint.parseResponse(response.data, toCurrency, amount);
      if (result !== undefined && result !== null && !isNaN(result) && result > 0) {
        return parseFloat(result);
      }
    }
    
    throw new Error('Invalid response format or zero result');
  }

  async getExchangeRates(baseCurrency = 'USD') {
    const errors = [];
    
    // First try the last successful endpoint if available
    if (this.lastSuccessfulEndpoint !== null) {
      try {
        const rates = await this.tryGetRates(this.endpoints[this.lastSuccessfulEndpoint], baseCurrency);
        return rates;
      } catch (error) {
        console.warn(`Last successful endpoint failed:`, error.message);
      }
    }
    
    // Try each endpoint until one succeeds
    for (let i = 0; i < this.endpoints.length; i++) {
      const endpoint = this.endpoints[this.currentEndpointIndex];
      
      try {
        const rates = await this.tryGetRates(endpoint, baseCurrency);
        this.lastSuccessfulEndpoint = this.currentEndpointIndex;
        return rates;
      } catch (error) {
        console.warn(`${endpoint.name} failed:`, error.message);
        errors.push(`${endpoint.name}: ${error.message}`);
        
        // Move to next endpoint
        this.currentEndpointIndex = (this.currentEndpointIndex + 1) % this.endpoints.length;
      }
    }
    
    throw new Error(`All currency APIs failed: ${errors.join(', ')}`);
  }

  async tryGetRates(endpoint, baseCurrency) {
    let url;
    if (endpoint.name === 'exchangerate.host') {
      url = `/latest?base=${baseCurrency}`;
    } else if (endpoint.name === 'frankfurter.app') {
      url = `/latest?from=${baseCurrency}`;
    } else if (endpoint.name === 'exchangerate-api') {
      url = `/latest/${baseCurrency}`;
    }
    
    const response = await apiClient.get(`${endpoint.baseUrl}${url}`);
    
    if (response.data && response.data.rates && Object.keys(response.data.rates).length > 0) {
      return response.data.rates;
    }
    
    throw new Error('Invalid response format or empty rates');
  }



  getSupportedCurrencies() {
    return [
      { value: "USD", label: "USD", flag: "🇺🇸", symbol: "$", name: "US Dollar" },
      { value: "EUR", label: "EUR", flag: "🇪🇺", symbol: "€", name: "Euro" },
      { value: "GBP", label: "GBP", flag: "🇬🇧", symbol: "£", name: "British Pound" },
      { value: "JPY", label: "JPY", flag: "🇯🇵", symbol: "¥", name: "Japanese Yen" },
      { value: "CAD", label: "CAD", flag: "🇨🇦", symbol: "$", name: "Canadian Dollar" },
      { value: "AUD", label: "AUD", flag: "🇦🇺", symbol: "$", name: "Australian Dollar" },
      { value: "EGP", label: "EGP", flag: "🇪🇬", symbol: "£", name: "Egyptian Pound" },
      { value: "SAR", label: "SAR", flag: "🇸🇦", symbol: "﷼", name: "Saudi Riyal" },
      { value: "CHF", label: "CHF", flag: "🇨🇭", symbol: "₣", name: "Swiss Franc" },
      { value: "CNY", label: "CNY", flag: "🇨🇳", symbol: "¥", name: "Chinese Yuan" }
    ];
  }
}

export const currencyService = new CurrencyService(); 