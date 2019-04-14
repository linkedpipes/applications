import types from './types';

const setUserProfile = profile => ({
  type: types.SET_USER_PROFILE,
  profile
});

const addDiscoverySession = ({ session }) => ({
  type: types.ADD_DISCOVERY_SESSION,
  session
});

const updateDiscoverySession = ({ session }) => ({
  type: types.UPDATE_DISCOVERY_SESSION,
  session
});

const addExecutionSession = ({ session }) => ({
  type: types.ADD_EXECUTION_SESSION,
  session
});

const updateExecutionSession = ({ session }) => ({
  type: types.UPDATE_EXECUTION_SESSION,
  session
});

const setUserProfileAsync = profile => {
  return dispatch =>
    new Promise(resolve => {
      dispatch(setUserProfile(profile));
      resolve();
    });
};

export default {
  setUserProfile,
  addDiscoverySession,
  updateDiscoverySession,
  addExecutionSession,
  updateExecutionSession,
  setUserProfileAsync
};
