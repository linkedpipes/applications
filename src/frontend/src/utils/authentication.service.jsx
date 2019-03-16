import axios from './api.service';

const AuthenticationService = {
  getUserProfile(webIdValue) {
    return axios.get('/user', { params: { webId: webIdValue } });
  }
};

export default AuthenticationService;
