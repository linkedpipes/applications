import types from './types';

const setApplication = applicationData => ({
  type: types.SET_APPLICATION,
  value: applicationData
});

const setApplicationMetadata = applicationMetadata => ({
  type: types.SET_APPLICATION_METADATA,
  value: applicationMetadata
});

const resetApplication = () => ({
  type: types.RESET_APPLICATION
});

const resetApplicationMetadata = () => ({
  type: types.RESET_APPLICATION_METADATA
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
  setApplicationMetadata,
  resetApplicationMetadata,
  resetApplication,
  setApplicationTitle,
  resetApplicationTitle
};
