import types from './types';

const INITIAL_STATE = {
  discoveryId: undefined,
  selectedPipelineGroup: {},
  datasources: [],
  pipelineGroups: []
};

const discoveryReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_DISCOVERY_ID:
      return { ...state, discoveryId: action.discovery.id };

    case types.SET_PIPELINE_GROUPS:
      return { ...state, pipelineGroups: action.pipelineGroups };

    case types.SET_SELECTED_PIPELINE_GROUP:
      return { ...state, selectedPipelineGroup: action.selectedPipelineGroup };

    default:
      return state;
  }
};

export default discoveryReducer;
