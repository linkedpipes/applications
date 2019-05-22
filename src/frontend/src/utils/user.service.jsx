import lpaAxios from './api.service';

const UserService = {
  getUserProfile(webIdValue) {
    return lpaAxios.post('/user', null, { params: { webId: webIdValue } });
  },

  deleteDiscovery(webId, discoveryId) {
    return lpaAxios.delete('/user/discovery', {
      params: { webId, discoveryId }
    });
  }
};

export default UserService;
