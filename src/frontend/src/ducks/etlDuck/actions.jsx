import types from './types';

const addSingleExecution = ({ id, executionIri } = {}) => ({
  type: types.ADD_EXECUTION,
  pipelineId: id,
  executionValues: {
    executionIri
  }
});

const removeSingleExecution = ({ id } = {}) => ({
  type: types.REMOVE_EXECUTION,
  id
});

const removeSingleExport = ({ id } = {}) => ({
  type: types.REMOVE_EXPORT,
  id
});

const addSelectedResultGraphIriAction = ({ data } = {}) => ({
  type: types.SET_SELECTED_RESULT_GRAPH_IRI,
  selectedResultGraphIri: data
});

const setPipelineIdAction = ({ id } = {}) => ({
  type: types.SET_PIPELINE_ID,
  pipeline: {
    id
  }
});

const setSelectedPipelineExecution = pipelineExecution => ({
  type: types.SET_PIPELINE_EXECUTION,
  pipelineExecution
});

export default {
  addSingleExecution,
  removeSingleExecution,
  removeSingleExport,
  addSelectedResultGraphIriAction,
  setPipelineIdAction,
  setSelectedPipelineExecution
};
