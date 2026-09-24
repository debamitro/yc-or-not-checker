import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from './useGoogleAnalytics';

/**
 * Component that tracks page views on route changes.
 * Place inside <BrowserRouter> but outside <Routes>.
 */
export default function GoogleAnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
}
