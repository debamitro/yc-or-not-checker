import { useEffect } from 'react';

// Declare gtag on the window object
declare global {
  interface Window {
    dataLayer: unknown[][];
    gtag: (...args: unknown[]) => void;
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

/**
 * Initialize Google Analytics by injecting the gtag.js script.
 * Only runs if VITE_GA_MEASUREMENT_ID is set.
 */
function initGoogleAnalytics() {
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
    console.info(
      '[GA] Google Analytics not initialized: VITE_GA_MEASUREMENT_ID is not configured.'
    );
    return;
  }

  // Load the gtag.js script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize the dataLayer and gtag function
  window.dataLayer = window.dataLayer || [];
  window.gtag = function (...args: unknown[]) {
    window.dataLayer.push(args);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID);
}

/**
 * Track a page view in Google Analytics.
 * @param path - The path of the page view (e.g., '/about')
 */
export function trackPageView(path: string) {
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') return;
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
  });
}

/**
 * Track a custom event in Google Analytics.
 * @param action - The event action (e.g., 'click')
 * @param category - The event category (e.g., 'engagement')
 * @param label - The event label (optional)
 * @param value - The event value (optional)
 */
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') return;
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
}

/**
 * React hook that initializes Google Analytics on mount.
 */
export function useGoogleAnalytics() {
  useEffect(() => {
    initGoogleAnalytics();
  }, []);
}

export { GA_MEASUREMENT_ID };
