import types from './types';

const addSelectedPipelineExecution = ({ data } = {}) => ({
  type: types.SET_EXECUTION,
  selectedPipelineExecution: data
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
  addSelectedPipelineExecution,
  addSelectedResultGraphIriAction,
  setPipelineIdAction
};
