import uuid from "uuid";

// ADD_EXPENSE
export const addVisualizer = ({ visualizersArray } = {}) => ({
  type: "ADD_VISUALIZER",
  visualizers: {
    id: uuid(),
    array: visualizersArray
  }
});

// REMOVE_SOURCE
export const removePipelines = ({ id } = {}) => ({
  type: "REMOVE_VISUALIZER",
  id: id
});
