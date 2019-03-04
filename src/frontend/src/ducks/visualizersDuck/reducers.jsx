import types from './types';

const INITIAL_STATE = { filters: [] };

const visualizersReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.ADD_FILTERS:
      return { ...state, filters: state.filters.concat(action.payload) };

    case types.ADD_FILTER:
      return { ...state, filters: [...state.filters, action.payload] };

    case types.TOGGLE_FILTER: {
      const newFilters = state.filters.map(filter => {
        if (filter.property.uri === action.payload.property.uri) {
          return {
            ...filter,
            enabled: !action.payload.enabled
          };
        }
        return filter;
      });
      return { ...state, filters: newFilters };
    }

    case types.TOGGLE_EXPAND_FILTER: {
      const newFilters = state.filters.map(filter => {
        if (filter.property.uri === action.payload.property.uri) {
          return {
            ...filter,
            expanded: !action.payload.expanded
          };
        }
        return filter;
      });
      return newFilters;
    }

    case types.TOGGLE_CHECKBOX:
      return state.map(filter => {
        if (filter.property.uri === action.payload.filterUri) {
          return {
            ...filter,
            options: filter.options.map(opt => {
              if (opt.skosConcept.uri === action.payload.optionUri) {
                return { ...opt, selected: !opt.selected };
              }
              return opt;
            })
          };
        }
        return filter;
      });

    case types.ADD_MULTIPLE_MARKERS:
      return state.concat(action.source);

    case types.TOGGLE_RADIO:
      return state.concat(action.payload);

    case types.ADD_VISUALIZER:
      return action.visualizers.array;

    case types.REMOVE_VISUALIZER:
      return state.filter(({ id }) => id !== action.pipelines.id);

    default:
      return state;
  }
};

export default visualizersReducer;
