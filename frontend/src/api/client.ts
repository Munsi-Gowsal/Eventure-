import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

// Store the access token in memory (never in localStorage for security)
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export const api = axios.create({
  baseURL: 'http://localhost:5001/api/v1',
  withCredentials: true, // Crucial for sending/receiving HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach the accessToken to every request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized for silent token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If the error is 401 and we haven't already retried this request
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // Prevent infinite loops if the refresh endpoint itself returns 401
      if (originalRequest.url?.includes('/auth/refresh') || originalRequest.url?.includes('/auth/login')) {
        setAccessToken(null);
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        // Attempt to refresh the token using the HTTP-only cookie
        const res = await axios.post(
          'http://localhost:5001/api/v1/auth/refresh',
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.data.accessToken;
        setAccessToken(newAccessToken);

        // Update the original request's Authorization header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        // Retry the original request with the new token
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed (cookie expired or invalid). Log out the user.
        setAccessToken(null);
        // Dispatch a custom event or redirect to login (handled in app root)
        window.dispatchEvent(new Event('auth:unauthorized'));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
