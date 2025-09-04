class APIClient {
  private baseURL: string;
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessingQueue = false;
  private maxConcurrentRequests = 2;
  private activeRequests = 0;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async processQueue() {
    if (this.isProcessingQueue || this.requestQueue.length === 0) return;

    this.isProcessingQueue = true;

    while (this.requestQueue.length > 0 && this.activeRequests < this.maxConcurrentRequests) {
      const request = this.requestQueue.shift();
      if (request) {
        this.activeRequests++;
        request().finally(() => {
          this.activeRequests--;
          this.processQueue();
        });
      }
    }

    this.isProcessingQueue = false;
  }

  private async makeRequest<T>(
    url: string,
    options: RequestInit = {},
    maxRetries = 3,
    timeout = 30000
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const requestFunction = async () => {
        let lastError: any;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            const response = await fetch(url, {
              ...options,
              signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
              const errorBody = await response.text();
              throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
            }
            
            if (response.status === 204 || response.headers.get("content-length") === "0") {
              resolve(null as T);
              return;
            }

            const data = await response.json();
            resolve(data);
            return;
          } catch (error) {
            lastError = error;
            console.warn(`Attempt ${attempt} failed:`, error);

            if (attempt < maxRetries) {
              const delay = Math.min(1000 * 2 ** (attempt - 1), 10000);
              await new Promise(res => setTimeout(res, delay));
            }
          }
        }
        reject(lastError);
      };

      this.requestQueue.push(requestFunction);
      this.processQueue();
    });
  }

  async get<T>(endpoint: string, customOptions: RequestInit = {}): Promise<T> {
    return this.makeRequest<T>(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      ...customOptions,
      headers: {
        'Content-Type': 'application/json',
        ...customOptions.headers,
      },
    });
  }

  async post<T>(endpoint: string, data: any, customOptions: RequestInit = {}): Promise<T> {
    return this.makeRequest<T>(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      ...customOptions,
      headers: {
        'Content-Type': 'application/json',
        ...customOptions.headers,
      },
      body: JSON.stringify(data),
    });
  }

  async getSequentially<T>(endpoints: string[]): Promise<T[]> {
    const results: T[] = [];
    for (const endpoint of endpoints) {
      try {
        const result = await this.get<T>(endpoint);
        results.push(result);
      } catch (error) {
        console.error(`Failed to fetch ${endpoint}:`, error);
        results.push(null as any);
      }
    }
    return results;
  }

  async keepAlive() {
    try {
      await this.makeRequest(`${this.baseURL}/health`, {}, 1, 5000);
    } catch (error) {
      console.warn('Keep-alive failed:', error);
    }
  }
}

export const apiClient = new APIClient(process.env.REACT_APP_API_URL || 'https://codeclash-r6wh.onrender.com/api');

setInterval(() => {
  apiClient.keepAlive();
}, 10 * 60 * 1000);