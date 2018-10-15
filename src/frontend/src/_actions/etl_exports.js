// ADD_PIPELINE
export const addSingleExport = ({
  id,
  resultGraphIri,
  etlPipelineIri
} = {}) => ({
  type: "ADD_EXPORT",
  pipelineId: id,
  exportValues: {
    resultGraphIri: resultGraphIri,
    etlPipelineIri: etlPipelineIri
  }
});

// REMOVE_PIPELINE
export const removeSingleExport = ({ id } = {}) => ({
  type: "REMOVE_EXPORT",
  id
});
