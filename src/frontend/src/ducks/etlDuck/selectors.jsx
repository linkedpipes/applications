// // Get etl executions

function getPipelineExecutionForExecutionIri(executions, executionIri) {
  return executions.filter(source => {
    return source.executionIri === executionIri;
  });
}

export default {
  getPipelineExecutionForExecutionIri
};
