// ADD_SOURCE
export const addSingleSource = ({ name, url } = {}) => ({
  type: "ADD_SOURCE",
  source: {
    name: name,
    url: url
  }
});

export const addMultipleSources = ({ sourcesList } = {}) => ({
  type: "ADD_MULTIPLE_SOURCES",
  source: sourcesList
});

// REMOVE_SOURCE
export const removeSingleSource = ({ url } = {}) => ({
  type: "REMOVE_SOURCE",
  url
});
