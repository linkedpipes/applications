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

const addSingleExport = ({ id, resultGraphIri, etlPipelineIri } = {}) => ({
  type: types.ADD_EXPORT,
  pipelineId: id,
  exportValues: {
    resultGraphIri,
    etlPipelineIri
  }
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

export default {
  addSingleExecution,
  removeSingleExecution,
  addSingleExport,
  removeSingleExport,
  addSelectedResultGraphIriAction,
  setPipelineIdAction
};
