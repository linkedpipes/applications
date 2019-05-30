import types from './types';

const INITIAL_STATE = {
  executions: {},
  exportRecords: {},
  pipelineExecution: undefined
};

const etlReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.ADD_EXECUTION:
      return {
        ...state,
        executions: {
          ...state.executions,
          [action.pipelineId]: action.executionValues
        }
      };

    case types.REMOVE_EXECUTION:
      return state.filter(({ id }) => id !== action.id);

    case types.ADD_EXPORT:
      return {
        ...state,
        exportRecords: {
          ...state.exportRecords,
          [action.pipelineId]: action.exportValues
        }
      };

    case types.SET_SELECTED_RESULT_GRAPH_IRI:
      return {
        ...state,
        selectedResultGraphIri: action.selectedResultGraphIri
      };

    case types.REMOVE_EXPORT:
      return state.filter(({ id }) => id !== action.id);

    case types.SET_PIPELINE_ID:
      return { ...state, pipelineId: action.pipeline.id };

    case types.SET_PIPELINE_EXECUTION:
      return { ...state, selectedPipelineExecution: action.pipelineExecution };

    default:
      return state;
  }
};

export default etlReducer;
