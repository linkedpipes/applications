import axios from './api.service';

const AuthenticationService = {
  getUserProfile(webIdValue) {
    return axios.post('/user', null, { params: { webId: webIdValue } });
  }
};

export default AuthenticationService;
