import types from './types';

const INITIAL_STATE = {
  activeStep: 0,
  etlExecutionStatus: false,
  dataSourcesUris: '',
  sparqlEndpointIri: '',
  dataSampleIri: '',
  namedGraph: '',
  tabValue: 0
};

const discoverReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.TAB_CHANGED: {
      const { tabValue } = action;
      return { ...state, tabValue };
    }
    case types.INCREMENT_ACTIVE_STEP: {
      const { value } = action;
      const { activeStep } = state;
      return { ...state, activeStep: activeStep + value };
    }

    case types.DECREMENT_ACTIVE_STEP: {
      const { value } = action;
      const { activeStep } = state;
      return { ...state, activeStep: activeStep - value };
    }

    case types.RESET_ACTIVE_STEP: {
      return { ...state, activeStep: 0 };
    }

    case types.SET_SELECTED_INPUT_EXAMPLE: {
      const { sample } = action;
      switch (sample.type) {
        case 'simple': {
          const uris = sample.URIS;
          const value = uris.join(',\n');
          return {
            ...state,
            dataSourcesUris: value,
            sparqlEndpointIri: '',
            dataSampleIri: '',
            namedGraph: '',
            tabValue: 0
          };
        }
        case 'advanced': {
          const { sparqlEndpointIri, dataSampleIri, namedGraph } = sample;
          return {
            ...state,
            dataSourcesUris: '',
            sparqlEndpointIri,
            dataSampleIri,
            namedGraph,
            tabValue: 1
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

    default:
      return state;
  }
};

export default discoverReducer;
