import axios from 'axios';

const AuthenticationService = {
  getUserProfile(webIdValue) {
    return axios.post('/user', null, { params: { webId: webIdValue } });
  }
};

export default AuthenticationService;
