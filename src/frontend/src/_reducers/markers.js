// Expenses Reducer
const markersReducerDefaultState = [];

export default (state = markersReducerDefaultState, action) => {
  switch (action.type) {
    case "ADD_MULTIPLE_MARKERS":
      return state.concat(action.source);
    default:
      return state;
  }
};
