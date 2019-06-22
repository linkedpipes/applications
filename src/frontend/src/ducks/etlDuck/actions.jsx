import types from './types';

const addSelectedResultGraphIriAction = selectedResultGraphIri => ({
  type: types.SET_SELECTED_RESULT_GRAPH_IRI,
  selectedResultGraphIri
});

const setPipelineIdAction = pipelineId => ({
  type: types.SET_PIPELINE_ID,
  pipeline: {
    id: pipelineId
  }
});

const setSelectedPipelineExecution = pipelineExecution => ({
  type: types.SET_PIPELINE_EXECUTION,
  pipelineExecution
});

export default {
  addSelectedResultGraphIriAction,
  setPipelineIdAction,
  setSelectedPipelineExecution
};
