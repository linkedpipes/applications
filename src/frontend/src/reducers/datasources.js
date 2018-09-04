// Expenses Reducer

const datasourceReducerDefaultState = [];

export default (state = datasourceReducerDefaultState, action) => {
  switch (action.type) {
    case "ADD_SOURCE":
      return [...state, action.source];
    case "REMOVE_SOURCE":
      return state.filter(({ id }) => id !== action.id);
    default:
      return state;
  }
};
