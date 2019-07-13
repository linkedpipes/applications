import types from './types';

const INITIAL_STATE = {
  activeStep: 0,
  etlExecutionStatus: false,
  dataSourcesUris: undefined,
  sparqlEndpointIri: '',
  dataSampleIri: '',
  namedGraph: '',
  rdfInputIri: '',
  rdfFile: undefined,
  rdfDataSampleFile: undefined,
  rdfUrlDataSampleIri: '',
  inputType: 'SPARQL_ENDPOINT',
  activeDiscoverTabIndex: 0
};

const discoverReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.INCREMENT_ACTIVE_STEP: {
      const { value } = action;
      const { activeStep } = state;
      return {
        ...state,
        activeStep: activeStep + value > 3 ? 3 : activeStep + value
      };
    }

    case types.SET_ACTIVE_STEP: {
      const { value } = action;
      return {
        ...state,
        activeStep: value
      };
    }

    case types.DECREMENT_ACTIVE_STEP: {
      const { value } = action;
      const { activeStep } = state;
      return {
        ...state,
        activeStep: activeStep - value < 0 ? 0 : activeStep - value
      };
    }

    case types.RESET_ACTIVE_STEP: {
      return { ...state, activeStep: 0 };
    }

    case types.RESET_SELECTED_INPUT_EXAMPLE: {
      return {
        ...state,
        dataSourcesUris: undefined,
        sparqlEndpointIri: '',
        dataSampleIri: '',
        namedGraph: '',
        rdfInputIri: '',
        rdfUrlDataSampleIri: '',
        rdfFile: undefined,
        rdfDataSampleFile: undefined
      };
    }

    case types.SET_SELECTED_INPUT_EXAMPLE: {
      const { sample } = action;
      const {
        sparqlEndpointIri,
        dataSampleIri,
        namedGraph,
        inputType
      } = sample;
      switch (inputType) {
        case 'SPARQL_ENDPOINT': {
          return {
            ...state,
            dataSourcesUris: undefined,
            sparqlEndpointIri,
            dataSampleIri,
            namedGraph,
            inputType,
            activeDiscoverTabIndex: 0
          };
        }
        default:
          return { ...state };
      }
    }

    case types.SET_ETL_EXECUTION_STATUS: {
      const { value } = action;
      return Object.assign({}, state, {
        ...state,
        etlExecutionStatus: value
      });
    }

    case types.SET_DATA_SAMPLE_IRI: {
      const { value } = action;
      return Object.assign({}, state, {
        ...state,
        dataSampleIri: value
      });
    }

    case types.SET_RDF_URL_DATA_SAMPLE_IRI: {
      const { value } = action;
      return Object.assign({}, state, {
        ...state,
        rdfUrlDataSampleIri: value
      });
    }

    case types.SET_SPARQL_ENDPOINT_IRI: {
      const { value } = action;
      return Object.assign({}, state, {
        ...state,
        sparqlEndpointIri: value
      });
    }

    case types.SET_NAMED_GRAPH: {
      const { value } = action;
      return Object.assign({}, state, {
        ...state,
        namedGraph: value
      });
    }

    case types.SET_RDF_RESOURCE_URL: {
      const { value } = action;
      return Object.assign({}, state, {
        ...state,
        rdfInputIri: value
      });
    }

    case types.SET_RDF_FILE: {
      const { value } = action;
      return Object.assign({}, state, {
        ...state,
        rdfFile: value
      });
    }

    case types.SET_RDF_DATA_SAMPLE_FILE: {
      const { value } = action;
      return Object.assign({}, state, {
        ...state,
        rdfDataSampleFile: value
      });
    }

    case types.SET_ACTIVE_DISCOVER_INPUT_TAB: {
      const { value } = action;

      let inputType = '';

      switch (value) {
        case 0:
          inputType = 'SPARQL_ENDPOINT';
          break;

        case 1:
          inputType = 'RDF_INPUT_IRI';
          break;

        case 2:
          inputType = 'RDF_INPUT_FILE';
          break;

        default:
          inputType = 'RDF_INPUT_IRI';
          break;
      }

      return Object.assign({}, state, {
        ...state,
        inputType,
        activeDiscoverTabIndex: value
      });
    }

    default:
      return state;
  }
};

export default discoverReducer;
