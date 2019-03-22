import types from './types';
import axios from 'axios';

const INITIAL_STATE = {
  activeStep: 0,
  etlExecutionStatus: false,
  dataSourcesUris: '',
  sparqlEndpointIri: '',
  dataSampleIri: '',
  namedGraph: ''
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
        dataSourcesUris: '',
        sparqlEndpointIri: '',
        dataSampleIri: '',
        namedGraph: ''
      };
    }

    case types.SET_SELECTED_INPUT_EXAMPLE: {
      const { sample } = action;
      switch (sample.type) {
        case 'ttlFile': {
          const { dataSourcesUris } = sample;
          return {
            ...state,
            dataSourcesUris,
            sparqlEndpointIri: '',
            dataSampleIri: '',
            namedGraph: ''
          };
        }
        case 'sparqlEndpoint': {
          const { sparqlEndpointIri, dataSampleIri, namedGraph } = sample;
          return {
            ...state,
            dataSourcesUris: '',
            sparqlEndpointIri,
            dataSampleIri,
            namedGraph
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
