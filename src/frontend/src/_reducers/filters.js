// Exports Reducer

const propertiesReducerDefaultState = [];

export default (state = propertiesReducerDefaultState, action) => {
  switch (action.type) {
    case "ADD_FILTER":
      return [...state, action.source];
    case "ADD_MULTIPLE_FILTERS":
      return state.concat(action.source);
    default:
      return state;
  }
};
