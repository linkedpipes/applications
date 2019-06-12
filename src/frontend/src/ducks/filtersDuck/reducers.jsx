import types from './types';
import { VISUALIZER_TYPE } from '@constants';

const INITIAL_STATE = {
  selectedScheme: undefined,
  nodes: undefined,
  filtersState: undefined
};

const filtersReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_SELECTED_SCHEME:
      return { nodes: null, selectedScheme: [action.selectedScheme] };
    case types.SET_SELECTED_NODES:
      return {
        filtersState: {
          ...state.filtersState,
          filterGroups: {
            ...state.filtersState.filterGroups,
            nodesFilter: {
              ...state.filtersState.filterGroups.nodesFilter,
              selectedOptions: { items: action.nodes }
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
                  selectedOptions: { items: [] }
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
                  selectedOptions: { items: [] }
                },
                nodesFilter: {
                  label: 'Nodes',
                  enabled: true,
                  visible: true,
                  filterType: 'NODES_FILTER',
                  selectedOptions: { items: [] }
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
