import axios from 'axios';
import { Log } from '@utils';

// {
//   // `data` is the response that was provided by the server
//   data: {},

//   // `status` is the HTTP status code from the server response
//   status: 200,

//   // `statusText` is the HTTP status message from the server response
//   statusText: 'OK',

//   // `headers` the headers that the server responded with
//   // All header names are lower cased
//   headers: {},

//   // `config` is the config that was provided to `axios` for the request
//   config: {},

//   // `request` is the request that generated this response
//   // It is the last ClientRequest instance in node.js (in redirects)
//   // and an XMLHttpRequest instance the browser
//   request: {}
// }

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
    }
  }
);
const wrappedAxios = axios;

export default wrappedAxios;
