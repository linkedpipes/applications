// ADD_PIPELINE
export const addSingleExecution = ({ id, executionIri } = {}) => ({
  type: 'ADD_EXECUTION',
  pipelineId: id,
  executionValues: {
    executionIri: executionIri
  }
});

// REMOVE_PIPELINE
export const removeSingleExecution = ({ id } = {}) => ({
  type: 'REMOVE_EXECUTION',
  id
});
