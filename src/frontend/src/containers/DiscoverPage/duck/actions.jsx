import types from './types';

const incrementActiveStep = value => {
  return {
    type: types.INCREMENT_ACTIVE_STEP,
    value
  };
};

const setActiveStep = value => {
  return {
    type: types.SET_ACTIVE_STEP,
    value
  };
};

const decrementActiveStep = value => {
  return {
    type: types.DECREMENT_ACTIVE_STEP,
    value
  };
};

const resetActiveStep = value => {
  return {
    type: types.RESET_ACTIVE_STEP,
    value
  };
};

const setSelectedInputExample = sample => {
  return {
    type: types.SET_SELECTED_INPUT_EXAMPLE,
    sample
  };
};

const resetSelectedInputExample = () => {
  return {
    type: types.RESET_SELECTED_INPUT_EXAMPLE
  };
};

const setEtlExecutionStatus = value => {
  return {
    type: types.SET_ETL_EXECUTION_STATUS,
    value
  };
};

const setNamedGraph = namedGraph => {
  return {
    type: types.SET_NAMED_GRAPH,
    value: namedGraph
  };
};

const setSparqlEndpointIri = sparqlEndpointIri => {
  return {
    type: types.SET_SPARQL_ENDPOINT_IRI,
    value: sparqlEndpointIri
  };
};

const setDataSampleIri = dataSampleIri => {
  return {
    type: types.SET_DATA_SAMPLE_IRI,
    value: dataSampleIri
  };
};

const setRdfInputIri = rdfInputIri => {
  return {
    type: types.SET_RDF_RESOURCE_URL,
    value: rdfInputIri
  };
};

const setRdfFile = rdfFile => {
  return {
    type: types.SET_RDF_FILE,
    value: rdfFile
  };
};

const setActiveDiscoverTabIndex = tabIndex => {
  return {
    type: types.SET_ACTIVE_DISCOVER_INPUT_TAB,
    value: tabIndex
  };
};

const setActiveDiscoverTabIndexAsync = tabIndex => {
  return dispatch => {
    dispatch(resetSelectedInputExample());
    dispatch(setActiveDiscoverTabIndex(tabIndex));
  };
};

export default {
  incrementActiveStep,
  decrementActiveStep,
  setActiveStep,
  resetActiveStep,
  setSelectedInputExample,
  resetSelectedInputExample,
  setEtlExecutionStatus,
  setNamedGraph,
  setSparqlEndpointIri,
  setDataSampleIri,
  setRdfInputIri,
  setRdfFile,
  setActiveDiscoverTabIndex,
  setActiveDiscoverTabIndexAsync
};
