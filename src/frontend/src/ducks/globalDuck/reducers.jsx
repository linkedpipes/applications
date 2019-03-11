import types from './types';

const INITIAL_STATE = {
  headerParams: {
    title: ''
  },
  selectedVisualizer: { visualizer: { visualizerCode: 'UNDEFINED' } }
};

const globalReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_DISCOVERY_ID:
      return { ...state, discoveryId: action.discovery.id };

    case types.SET_PIPELINE_ID:
      return { ...state, pipelineId: action.pipeline.id };

    case types.SET_SELECTED_VISUALIZER:
      return Object.assign({}, state, {
        selectedVisualizer: action.selectedVisualizer
      });
    case types.SET_SELECTED_RESULT_GRAPH_IRI:
      return {
        ...state,
        selectedResultGraphIri: action.selectedResultGraphIri
      };
    default:
      return { ...state };
  }
};

export default globalReducer;
