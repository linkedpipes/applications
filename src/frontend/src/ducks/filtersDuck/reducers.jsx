import types from './types';
import { VISUALIZER_TYPE } from '@constants';

const INITIAL_STATE = {
  selectedScheme: null,
  nodes: null,
  filtersState: null
};

const filtersReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_SELECTED_MAP_OPTIONS:
      return {
        filtersState: {
          ...state.filtersState,
          filterGroups: {
            ...state.filtersState.filterGroups,
            mapFilters: {
              ...state.filtersState.filterGroups.mapFilters,
              filters: action.filters
            }
          }
        }
      };
    case types.SET_SELECTED_SCHEME:
      return {
        filtersState: {
          ...state.filtersState,
          filterGroups: {
            ...state.filtersState.filterGroups,
            schemeFilter: {
              ...state.filtersState.filterGroups.schemeFilter,
              options: action.schemes
            }
          }
        }
      };
    case types.SET_SELECTED_NODES:
      return {
        filtersState: {
          ...state.filtersState,
          filterGroups: {
            ...state.filtersState.filterGroups,
            nodesFilter: {
              ...state.filtersState.filterGroups.nodesFilter,
              options: action.nodes
            }
          }
        }
      };
    case types.TOGGLE_ENABLED:
      return {
        ...state,
        filtersState: {
          ...state.filtersState,
          enabled: action.value
        }
      };
    case types.TOGGLE_VISIBLE:
      return {
        ...state,
        filtersState: {
          ...state.filtersState,
          visible: action.value
        }
      };

    case types.SET_FILTERS_STATE:
      return {
        ...state,
        filtersState: action.value
      };

    case types.SET_DEFAULT_FILTERS_STATE:
      switch (action.visualizerCode) {
        case VISUALIZER_TYPE.CHORD:
          return {
            filtersState: {
              enabled: true,
              visible: true,
              filterGroups: {
                nodesFilter: {
                  label: 'Nodes',
                  enabled: true,
                  visible: true,
                  filterType: 'NODES_FILTER',
                  options: []
                }
              }
            }
          };
        case VISUALIZER_TYPE.TREEMAP:
          return {
            filtersState: {
              enabled: true,
              visible: true,
              filterGroups: {
                schemeFilter: {
                  label: 'Scheme',
                  enabled: true,
                  visible: true,
                  filterType: 'SCHEME_FILTER',
                  options: []
                }
              }
            }
          };
        case VISUALIZER_TYPE.ADVANCED_FILTERS_MAP:
          return {
            filtersState: {
              enabled: true,
              visible: true,
              filterGroups: {
                mapFilters: {
                  label: 'Schemes',
                  enabled: true,
                  visible: true,
                  filterType: 'MAP_SCHEMES_FILTER',
                  filters: []
                }
              }
            }
          };

        case VISUALIZER_TYPE.RESET_FILTERS:
          return INITIAL_STATE;

        default:
          return state;
      }
    default:
      return state;
  }
};

export default filtersReducer;
