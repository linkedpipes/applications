import types from './types';

const INITIAL_STATE = {
  selectedResultGraphIri: undefined,
  selectedPipelineExecution: undefined,
  pipelineId: undefined
};

const etlReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_SELECTED_RESULT_GRAPH_IRI:
      return {
        ...state,
        selectedResultGraphIri: action.selectedResultGraphIri
      };

    case types.SET_PIPELINE_ID:
      return { ...state, pipelineId: action.pipeline.id };

    case types.SET_PIPELINE_EXECUTION:
      return { ...state, selectedPipelineExecution: action.pipelineExecution };

    default:
      return state;
  }
};

export default etlReducer;
