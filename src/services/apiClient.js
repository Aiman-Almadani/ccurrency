class ApiClient {
  constructor() {
    this.timeout = 5000; // Reduced to 5 seconds for faster fallback
    this.retryAttempts = 2; // Reduced to 2 attempts for faster fallback
    this.retryDelay = 500; // Reduced to 500ms for faster fallback
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
  }

  async get(url, options = {}) {
    // Check cache first
    const cachedResponse = this.getFromCache(url);
    if (cachedResponse) {
      return cachedResponse;
    }

    const response = await this.request(url, { ...options, method: 'GET' });
    
    // Cache successful responses
    if (response.data) {
      this.setCache(url, response);
    }
    
    return response;
  }

  async post(url, data, options = {}) {
    return this.request(url, { 
      ...options, 
      method: 'POST', 
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
  }

  async request(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const requestOptions = {
      ...options,
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        ...options.headers
      }
    };

    let lastError;
    let attempt = 0;
    
    while (attempt < this.retryAttempts) {
      try {
        const response = await fetch(url, requestOptions);
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
        }
        
        const data = await response.json();
        return { data, status: response.status, headers: response.headers };
      } catch (error) {
        lastError = error;
        attempt++;
        
        if (error.name === 'AbortError') {
          throw new Error(`Request timeout after ${this.timeout}ms`);
        }
        
        // Don't retry on certain error types
        if (error.message.includes('404') || error.message.includes('401')) {
          throw error;
        }
        
        if (attempt < this.retryAttempts) {
          const delay = this.retryDelay * Math.pow(2, attempt - 1);
          await this.delay(delay);
          continue;
        }
      }
    }
    
    clearTimeout(timeoutId);
    throw lastError || new Error('Request failed after retries');
  }

  getFromCache(url) {
    const cached = this.cache.get(url);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.response;
    }
    this.cache.delete(url);
    return null;
  }

  setCache(url, response) {
    this.cache.set(url, {
      response,
      timestamp: Date.now()
    });
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const apiClient = new ApiClient(); 