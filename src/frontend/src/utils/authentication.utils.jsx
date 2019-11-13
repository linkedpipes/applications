import { StorageAuthenticationManager } from 'linkedpipes-storage';

const getWebIdIfSessionValid = async () => {
  return new Promise(async resolve => {
    const session = await StorageAuthenticationManager.currentSession();

    if (!session) {
      resolve(undefined);
    } else {
      resolve(session.webId);
    }
  });
};

export default {
  getWebIdIfSessionValid
};
