import types from './types';

export const incrementActiveStep = value => {
  return {
    type: types.INCREMENT_ACTIVE_STEP,
    value
  };
};

export const decrementActiveStep = value => {
  return {
    type: types.DECREMENT_ACTIVE_STEP,
    value
  };
};

export const resetActiveStep = value => {
  return {
    type: types.RESET_ACTIVE_STEP,
    value
  };
};

export const setSelectedInputExample = sample => {
  return {
    type: types.SET_SELECTED_INPUT_EXAMPLE,
    sample
  };
};

export const resetSelectedInputExample = () => {
  return {
    type: types.RESET_SELECTED_INPUT_EXAMPLE
  };
};

export const setEtlExecutionStatus = value => {
  return {
    type: types.SET_ETL_EXECUTION_STATUS,
    value
  };
};

export const setNamedGraph = namedGraph => {
  return {
    type: types.SET_NAMED_GRAPH,
    namedGraph
  };
};

export const setSparqlEndpointIri = sparqlEndpointIri => {
  return {
    type: types.SET_SPARQL_ENDPOINT_IRI,
    sparqlEndpointIri
  };
};

export const setDataSampleIri = dataSampleIri => {
  return {
    type: types.SET_DATA_SAMPLE_IRI,
    dataSampleIri
  };
};

export default {
  incrementActiveStep,
  decrementActiveStep,
  resetActiveStep,
  setSelectedInputExample,
  resetSelectedInputExample,
  setEtlExecutionStatus,
  setNamedGraph,
  setSparqlEndpointIri,
  setDataSampleIri
};
