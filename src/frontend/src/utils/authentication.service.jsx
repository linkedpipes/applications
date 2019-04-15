import lpaAxios from './api.service';

const AuthenticationService = {
  getUserProfile(webIdValue) {
    return lpaAxios.post('/user', null, { params: { webId: webIdValue } });
  }
};

export default AuthenticationService;
