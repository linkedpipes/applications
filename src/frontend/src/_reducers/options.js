import {
  TOGGLE_FILTER,
  TOGGLE_EXPAND_FILTER,
  ADD_FILTERS,
  ADD_FILTER
} from "../_constants/filters.constants";

export default (state = [], action) => {
  switch (action.type) {
    case TOGGLE_RADIO:
      return state.concat(action.payload);
    case TOGGLE_CHECKBOX:
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
    default:
      return state;
  }
};
