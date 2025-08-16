/**
 * Environment configuration utility
 * Centralizes access to environment variables with type safety
 */

export const env = {
  // App Configuration
  APP_TITLE: import.meta.env.VITE_APP_TITLE || 'React Vite Boilerplate',
  APP_DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION || 'A modern React application',
  
  // Development Configuration
  DEV_PORT: Number(import.meta.env.VITE_DEV_PORT) || 5173,
  DEV_HOST: import.meta.env.VITE_DEV_HOST || 'localhost',
  
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  API_TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  
  // Feature Flags
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_ERROR_REPORTING: import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true',
  ENABLE_PWA: import.meta.env.VITE_ENABLE_PWA === 'true',
  
  // Third-party Services
  GOOGLE_ANALYTICS_ID: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
  
  // Environment
  NODE_ENV: import.meta.env.NODE_ENV || 'development',
  MODE: import.meta.env.MODE || 'development',
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
} as const;

/**
 * Type-safe environment variable checker
 */
export const isDevelopment = () => env.NODE_ENV === 'development';
export const isProduction = () => env.NODE_ENV === 'production';
export const isTest = () => env.NODE_ENV === 'test';

/**
 * Validates required environment variables
 * Call this early in your application to ensure all required env vars are present
 */
export function validateEnvironment() {
  const errors: string[] = [];
  
  // Add validation for required environment variables here
  // Example:
  // if (env.PROD && !env.API_BASE_URL) {
  //   errors.push('VITE_API_BASE_URL is required in production');
  // }
  
  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n${errors.join('\n')}`);
  }
}

/**
 * Gets the base URL for the application
 */
export function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Fallback for SSR
  return env.DEV 
    ? `http://${env.DEV_HOST}:${env.DEV_PORT}`
    : 'https://your-domain.com';
}