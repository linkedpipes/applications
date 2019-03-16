import axios from './api.service';

const AuthenticationService = {
  authorizeUser(webIdValue) {
    return axios.post('/user', {
      webId: webIdValue
    });
  },

  getUserProfile(webIdValue) {
    return axios.get('/user', { params: { webId: webIdValue } });
  }
};

export default AuthenticationService;
