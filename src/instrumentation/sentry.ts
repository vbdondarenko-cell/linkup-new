import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN;
const NODE_ENV = process.env.NODE_ENV;

export function initSentry(): void {
  if (!SENTRY_DSN || NODE_ENV === 'development') {
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    
    // Performance Monitoring
    tracesSampleRate: NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // Error collection
    attachStacktrace: true,
    debug: false,
    
    // Environment
    environment: NODE_ENV || 'development',
    
    // Release tracking
    release: process.env.APP_VERSION || 'unknown',
    
    // Filtering
    denyUrls: [
      /localhost/,
      /\.map$/,
      /favicon\.ico$/,
    ],
    
    // Ignore errors
    ignoreErrors: [
      'Non-Error promise rejection captured',
      'Unhandled Promise Rejection',
    ],
    
    // Custom tags
    initialScope: {
      tags: {
        version: process.env.APP_VERSION || 'unknown',
      },
    },
    
    // Integrations
    integrations: [
      new Sentry.BrowserTracing(),
      new Sentry.Replay({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    
    // Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

// Performance monitoring helper
export function trackPerformance(
  name: string,
  startTime: number,
  tags?: Record<string, string>
): void {
  const duration = Date.now() - startTime;
  
  Sentry.addBreadcrumb({
    category: 'performance',
    message: `${name}: ${duration}ms`,
    data: { duration, name, ...tags },
  });
  
  if (duration > 1000) {
    Sentry.captureMessage(`Slow operation: ${name} took ${duration}ms`, 'warning');
  }
}

// Error boundary helper
export function captureError(
  error: Error,
  context?: Record<string, unknown>
): void {
  Sentry.captureException(error, {
    extra: context,
  });
}

// User tracking
export function setUserContext(userId: string, metadata?: {
  email?: string;
  username?: string;
}): void {
  Sentry.setUser({
    id: userId,
    email: metadata?.email,
    username: metadata?.username,
  });
}

// Clear user context on logout
export function clearUserContext(): void {
  Sentry.setUser(null);
}
