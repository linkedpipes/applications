import types from './types';

const INITIAL_STATE = {
  sparqlEndpointIri: '',
  dataSampleIri: '',
  namedGraph: '',
  selectedTab: 0
};

const globalReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_DISCOVERY_ID:
      return { ...state, discoveryId: action.discovery.id };

    case types.TAB_CHANGED:
      return { ...state, selectedTab: action.selectedTab };
    case types.SET_SELECTED_DATASOURCES_EXAMPLE:
      switch (action.sample.type) {
        case 'Simple': {
          const uris = action.sample.URIS;
          const value = uris.join(',\n');
          return {
            ...state,
            datasourcesValues: value,
            sparqlEndpointIri: '',
            dataSampleIri: '',
            namedGraph: ''
          };
        }
        case 'Advanced': {
          const {
            sparqlEndpointIri,
            dataSampleIri,
            namedGraph
          } = action.sample;
          return {
            ...state,
            datasourcesValues: null,
            selectedResultGraphIri: null,
            sparqlEndpointIri,
            dataSampleIri,
            namedGraph
          };
        }
        default:
          return { ...state };
      }
    case types.SET_SELECTED_VISUALIZER:
      return Object.assign({}, state, {
        selectedVisualizer: action.selectedVisualizer
      });
    case types.SET_SELECTED_RESULT_GRAPH_IRI:
      return {
        ...state,
        selectedResultGraphIri: action.selectedResultGraphIri
      };
    default:
      return { ...state };
  }
};

export default globalReducer;
