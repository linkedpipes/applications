import uuid from "uuid";

// ADD_EXPENSE
export const addPipelines = ({ pipelinesArray } = {}) => ({
  type: "ADD_PIPELINES",
  pipelines: {
    id: uuid(),
    array: pipelinesArray
  }
});

// REMOVE_SOURCE
export const removePipelines = ({ id } = {}) => ({
  type: "REMOVE_PIPELINES",
  id: id
});
