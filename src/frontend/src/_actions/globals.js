// ADD_DISCOVERY
export const addDiscoveryIdAction = ({ id } = {}) => ({
  type: "SET_DISCOVERY_ID",
  discovery: {
    id: id
  }
});

// ADD_SELECTED_VIZUALIZER
export const addSelectedVisualizerAction = ({ data } = {}) => ({
  type: "SET_SELECTED_VISUALIZER",
  selectedVisualizer: data
});
