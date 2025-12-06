import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URI,
  withCredentials: true,
});

// -------------------------------
// Token Management
// -------------------------------
const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null; // ✅ SSR safety
  return localStorage.getItem('accessToken');
};

const setStoredToken = (token: string): void => {
  if (typeof window === 'undefined') return; // ✅ SSR safety
  localStorage.setItem('accessToken', token);
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

const clearTokens = (): void => {
  if (typeof window === 'undefined') return; // ✅ SSR safety
  localStorage.removeItem('accessToken');
  delete axiosInstance.defaults.headers.common['Authorization'];
};

// -------------------------------
// Public Routes (don't require auth)
// -------------------------------
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/verify-email'
];

const isPublicRoute = (): boolean => {
  if (typeof window === 'undefined') return false;
  const pathname = window.location.pathname;
  return PUBLIC_ROUTES.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
};

// -------------------------------
// Refresh Token Logic
// -------------------------------
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const onRefreshSuccess = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

// -------------------------------
// Logout Handler
// -------------------------------
const handleLogout = () => {
  clearTokens();
  
  // Call logout endpoint (optional, don't wait for response)
  axiosInstance.post('/auth/logout', {}, { withCredentials: true }).catch(() => {});
  
  // ✅ Only redirect if NOT already on login or public page
  if (typeof window !== 'undefined' && 
      !isPublicRoute() && 
      window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

// -------------------------------
// REQUEST INTERCEPTOR
// -------------------------------
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getStoredToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// -------------------------------
// RESPONSE INTERCEPTOR
// -------------------------------
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Skip non-401 errors
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }
    
    // ✅ If on public page and 401, just reject without redirect/refresh
    // This allows components to handle "not logged in" gracefully
    if (isPublicRoute()) {
      return Promise.reject(error);
    }
    
    // Skip refresh endpoint to avoid loops
    if (originalRequest.url?.includes('/auth/refresh-token') || 
        originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/signup') ||
        originalRequest.url?.includes('/auth/logout')) {
      handleLogout();
      return Promise.reject(error);
    }
    
    // Already retried → logout
    if (originalRequest._retry) {
      handleLogout();
      return Promise.reject(error);
    }
    
    // Queue requests during refresh
    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeTokenRefresh((token: string) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(axiosInstance(originalRequest));
        });
      });
    }
    
    // Start refresh
    originalRequest._retry = true;
    isRefreshing = true;
    
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URI}/auth/refresh-token`,
        {},
        { 
          withCredentials: true,
          baseURL: process.env.NEXT_PUBLIC_URI
        }
      );
      
      const { accessToken } = response.data;
      
      if (!accessToken) {
        throw new Error('No access token in refresh response');
      }
      
      setStoredToken(accessToken);
      
      isRefreshing = false;
      onRefreshSuccess(accessToken);
      
      // Retry original request
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      isRefreshing = false;
      refreshSubscribers = [];
      handleLogout();
      return Promise.reject(refreshError);
    }
  }
);

// -------------------------------
// Helper methods
// -------------------------------
export const setAuthToken = (token: string): void => {
  setStoredToken(token);
};

export const clearAuth = (): void => {
  handleLogout();
};

export default axiosInstance;