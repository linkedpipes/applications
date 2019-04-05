import types from './types';

const setApplication = applicationData => ({
  type: types.SET_APPLICATION,
  value: applicationData
});

const setApplicationTitle = applicationTitle => ({
  type: types.SET_APPLICATION_TITLE,
  value: applicationTitle
});

export default {
  setApplication,
  setApplicationTitle
};
