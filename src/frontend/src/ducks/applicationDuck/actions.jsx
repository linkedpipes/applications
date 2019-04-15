import types from './types';

const setApplication = applicationData => ({
  type: types.SET_APPLICATION,
  value: applicationData
});

const resetApplication = () => ({
  type: types.RESET_APPLICATION
});

const setApplicationTitle = applicationTitle => ({
  type: types.SET_APPLICATION_TITLE,
  value: applicationTitle
});

const resetApplicationTitle = () => ({
  type: types.RESET_APPLICATION_TITLE
});

export default {
  setApplication,
  resetApplication,
  setApplicationTitle,
  resetApplicationTitle
};
