import lpaAxios from './api.service';

const UserService = {
  getUserProfile(webIdValue) {
    return lpaAxios.post('/user', null, { params: { webId: webIdValue } });
  },

  deleteDiscovery(webId, discoveryId, socketId) {
    return lpaAxios.delete('/user/discovery', {
      params: { webId, discoveryId, socketId }
    });
  },

  deletePipelineExecution(webId, executionIri, socketId) {
    return lpaAxios.delete('/user/execution', {
      params: { webId, executionIri, socketId }
    });
  },

  postApplication(webId, solidIri, executionIri) {
    return lpaAxios.post('/user/application', null, {
      params: { webId, solidIri, executionIri }
    });
  },

  deleteApplication(webId, solidIri) {
    return lpaAxios.delete('/user/application', {
      params: { webId, solidIri }
    });
  }
};

export default UserService;
