import ReactGA from 'react-ga';

const trackPage = page => {
  ReactGA.set({
    page
  });
  ReactGA.pageview(page);
};

export default {
  trackPage
};
