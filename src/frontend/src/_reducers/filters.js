import {
  TOGGLE_FILTER,
  TOGGLE_EXPAND_FILTER,
  ADD_FILTERS,
  ADD_FILTER
} from "../_constants/filters.constants";

export default (state = [], action) => {
  switch (action.type) {
    case ADD_FILTERS:
      return state.concat(action.payload);
    case ADD_FILTER:
      return [...state, action.payload];
    case TOGGLE_FILTER:
      return state.filters.map(filter => {
        if (filter.property.uri === action.payload.property.uri) {
          return {
            ...filter,
            enabled: !action.payload.enabled
          };
        }
        return filter;
      });
    case TOGGLE_EXPAND_FILTER:
      return state.map(filter => {
        if (filter.property.uri === action.payload.property.uri) {
          return {
            ...filter,
            expanded: !action.payload.expanded
          };
        }
        return filter;
      });
    case TOGGLE_RADIO:
      return state.concat(action.payload);
    case TOGGLE_CHECKBOX:
      return [...state, action.payload];
    default:
      return state;
  }
};
