// ADD_SOURCE
export const addSource = ({ name, url } = {}) => ({
  type: "ADD_SOURCE",
  source: {
    name: name,
    url: url
  }
});

// REMOVE_SOURCE
export const removeSource = ({ url } = {}) => ({
  type: "REMOVE_SOURCE",
  url
});
