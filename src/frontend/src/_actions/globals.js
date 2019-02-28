// ADD_DISCOVERY
export const addDiscoveryIdAction = ({ id } = {}) => ({
  type: 'SET_DISCOVERY_ID',
  discovery: {
    id
  }
});

// ADD_SELECTED_VIZUALIZER
export const addSelectedVisualizerAction = ({ data } = {}) => {
  return {
    type: 'SET_SELECTED_VISUALIZER',
    selectedVisualizer: data
  };
};

// SET_SELECTED_DATASOURCES_EXAMPLE
export const setSelectedDatasourcesExample = ({ sample } = {}) => ({
  type: "SET_SELECTED_DATASOURCES_EXAMPLE",
  sample: sample
});

// ADD_SELECTED_RESULT_GRAPH_IRI_ACTION
export const addSelectedResultGraphIriAction = ({ data } = {}) => ({
  type: 'SET_SELECTED_RESULT_GRAPH_IRI',
  selectedResultGraphIri: data
});

// TAB CHANGED
export const changeTabAction = ({ selectedTab } = {}) => ({
  type: "TAB_CHANGED",
  selectedTab: selectedTab
});
