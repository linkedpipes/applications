import types from './types';

const addDiscoveryIdAction = ({ id } = {}) => ({
  type: types.SET_DISCOVERY_ID,
  discovery: {
    id
  }
});

const addSelectedVisualizerAction = ({ data } = {}) => {
  return {
    type: types.SET_SELECTED_VISUALIZER,
    selectedVisualizer: data
  };
};

const setSelectedDatasourcesExample = ({ sample } = {}) => ({
  type: types.SET_SELECTED_DATASOURCES_EXAMPLE,
  sample
});

const addSelectedResultGraphIriAction = ({ data } = {}) => ({
  type: types.SET_SELECTED_RESULT_GRAPH_IRI,
  selectedResultGraphIri: data
});

const changeTabAction = ({ selectedTab } = {}) => ({
  type: types.TAB_CHANGED,
  selectedTab
});

export default {
  addDiscoveryIdAction,
  addSelectedVisualizerAction,
  setSelectedDatasourcesExample,
  addSelectedResultGraphIriAction,
  changeTabAction
};
