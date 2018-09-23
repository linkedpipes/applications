// ADD_PIPELINE
export const addSingleExecution = ({
  id,
  resultGraphIri,
  etlPipelineIri
} = {}) => ({
  type: "ADD_EXECUTION",
  pipelineId: id,
  executionValues: {
    resultGraphIri: resultGraphIri,
    etlPipelineIri: etlPipelineIri
  }
});

// REMOVE_PIPELINE
export const removeSingleExecution = ({ id } = {}) => ({
  type: "REMOVE_EXECUTION",
  id
});
