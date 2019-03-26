import types from './types';

const setUserProfile = profile => ({
  type: types.SET_USER_PROFILE,
  profile
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
  setUserProfileAsync
};
