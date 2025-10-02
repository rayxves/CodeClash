class APIClient {
  private baseURL: string;
  private requestQueue: Array<() => Promise<any>> = [];
  private activeRequests = 0;
  private maxConcurrentRequests = 2;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async processQueue() {
    while (
      this.requestQueue.length &&
      this.activeRequests < this.maxConcurrentRequests
    ) {
      const request = this.requestQueue.shift();
      if (request) {
        this.activeRequests++;
        request().finally(() => {
          this.activeRequests--;
          this.processQueue();
        });
      }
    }
  }

  private makeRequest<T>(
    url: string,
    options: RequestInit = {},
    retries = 2,
    timeout = 30000
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const requestFn = async () => {
        let lastError: any;
        for (let attempt = 1; attempt <= retries; attempt++) {
          try {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), timeout);
            const response = await fetch(url, {
              ...options,
              signal: controller.signal,
            });
            clearTimeout(timer);

            if (!response.ok) {
              const text = await response.text();
              throw new Error(`HTTP ${response.status}: ${text}`);
            }

            if (
              response.status === 204 ||
              response.headers.get("content-length") === "0"
            ) {
              resolve(null as T);
              return;
            }

            resolve(await response.json());
            return;
          } catch (err) {
            lastError = err;
            if (attempt < retries)
              await new Promise((res) => setTimeout(res, 500 * attempt));
          }
        }
        reject(lastError);
      };

      this.requestQueue.push(requestFn);
      this.processQueue();
    });
  }

  get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.makeRequest<T>(`${this.baseURL}${endpoint}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
    });
  }

  post<T>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> {
    return this.makeRequest<T>(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...options.headers },
      body: JSON.stringify(data),
      ...options,
    });
  }

}

export const apiClient = new APIClient(
  "http://localhost:5070/api"
);

