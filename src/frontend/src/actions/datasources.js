import uuid from "uuid";

// ADD_EXPENSE
export const addSource = ({ name, url } = {}) => ({
  type: "ADD_SOURCE",
  source: {
    id: uuid(),
    name: name,
    url: url
  }
});

// REMOVE_SOURCE
export const removeSource = ({ id } = {}) => ({
  type: "REMOVE_SOURCE",
  id
});
