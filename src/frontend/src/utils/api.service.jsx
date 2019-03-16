import axios from 'axios';
import { Log } from '@utils';
import * as Sentry from '@sentry/browser';

axios.defaults.baseURL = process.env.BASE_BACKEND_URL || '/api';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // handle error
    if (error.response) {
      Log.error(error.response.data.message);
      Sentry.withScope(scope => {
        scope.setLevel('error');
        scope.setExtra('api-call', error.response.data);
        Sentry.captureException(error);
        Sentry.showReportDialog(); // Only if not production
      });
    }
  }
);
const wrappedAxios = axios;

export default wrappedAxios;
