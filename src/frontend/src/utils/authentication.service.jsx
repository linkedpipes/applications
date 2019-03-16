import { BASE_URL, rest } from './api.service';
import { getQueryString } from './global.utils';

const USER_URL = `${BASE_URL}user`;

const USER_URL_WITH_WEB_ID = webId => {
  return webId
    ? `${USER_URL}?${getQueryString({
        webId
      })}`
    : '';
};

const AuthenticationService = {
  authorizeUser(webIdValue) {
    return rest(USER_URL_WITH_WEB_ID(webIdValue), undefined, 'POST', undefined);
  },

  getUserProfile(webIdValue) {
    return rest(USER_URL_WITH_WEB_ID(webIdValue), undefined, 'GET', undefined);
  }
};

export default AuthenticationService;
