import types from './types';

const setUserProfile = profile => ({
  type: types.SET_USER_PROFILE,
  profile
});

const setSolidUserProfile = (profile, solidUsername, solidImage) => ({
  type: types.SET_SOLID_USER_PROFILE,
  profile,
  solidUsername,
  solidImage
});

const setUserWebId = value => ({
  type: types.SET_USER_WEBID,
  value
});

const setSolidName = value => ({
  type: types.SET_USER_SOLID_NAME,
  value
});

const setSolidImage = value => ({
  type: types.SET_USER_SOLID_IMAGE,
  value
});

const addDiscoverySession = ({ session }) => ({
  type: types.ADD_DISCOVERY_SESSION,
  session
});

const deleteDiscoverySession = ({ discoveryId }) => ({
  type: types.DELETE_DISCOVERY_SESSION,
  discoveryId
});

const updateDiscoverySession = ({ session }) => ({
  type: types.UPDATE_DISCOVERY_SESSION,
  session
});

const addExecutionSession = ({ session }) => ({
  type: types.ADD_EXECUTION_SESSION,
  session
});

const deleteExecutionSession = ({ executionIri }) => ({
  type: types.DELETE_EXECUTION_SESSION,
  executionIri
});

const updateExecutionSession = ({ session }) => ({
  type: types.UPDATE_EXECUTION_SESSION,
  session
});

const updateApplicationsFolder = ({ value }) => ({
  type: types.UPDATE_APPLICATIONS_FOLDER,
  value
});

const setUserProfileAsync = profile => {
  return dispatch =>
    new Promise(resolve => {
      dispatch(setUserProfile(profile));
      resolve();
    });
};

const setUserInboxInvitations = inboxInvitations => ({
  type: types.SET_USER_INBOX_INVITATIONS,
  value: inboxInvitations
});

const setSolidUserProfileAsync = (profile, solidUsername, solidImage) => {
  return dispatch =>
    new Promise(resolve => {
      dispatch(setSolidUserProfile(profile, solidUsername, solidImage));
      resolve();
    });
};

const setLightColorTheme = isLight => {
  return {
    type: types.SET_LIGHT_COLOR_THEME,
    value: isLight
  };
};

export default {
  setUserProfile,
  setUserWebId,
  setSolidName,
  setSolidImage,
  addDiscoverySession,
  deleteDiscoverySession,
  updateDiscoverySession,
  addExecutionSession,
  deleteExecutionSession,
  updateExecutionSession,
  setUserProfileAsync,
  updateApplicationsFolder,
  setUserInboxInvitations,
  setSolidUserProfileAsync,
  setLightColorTheme
};
