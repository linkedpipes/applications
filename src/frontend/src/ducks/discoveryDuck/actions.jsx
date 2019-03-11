import types from './types';

const addSingleSource = ({ name, url } = {}) => ({
  type: types.ADD_SOURCE,
  source: {
    name,
    url
  }
});

const addMultipleSources = ({ sourcesList } = {}) => ({
  type: types.ADD_MULTIPLE_SOURCES,
  source: sourcesList
});

const removeSingleSource = ({ url } = {}) => ({
  type: types.REMOVE_SOURCE,
  url
});

export default {
  addSingleSource,
  addMultipleSources,
  removeSingleSource
};
