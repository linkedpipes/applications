import GoogleAnalytics from 'react-ga';

const initialize = apiKey => {
  GoogleAnalytics.initialize(apiKey);
};

const trackPage = page => {
  GoogleAnalytics.set({
    page
  });
  GoogleAnalytics.pageview(page);
};

const trackEvent = eventData => {
  GoogleAnalytics.event(eventData);
};

export default {
  initialize,
  trackPage,
  trackEvent
};
