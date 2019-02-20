// Expenses Reducer
const datasourceReducerDefaultState = [];

export default (state = datasourceReducerDefaultState, action) => {
  switch (action.type) {
    case 'ADD_SOURCE':
      return [...state, action.source];
    case 'ADD_MULTIPLE_SOURCES':
      return state.concat(action.source);
    case 'REMOVE_SOURCE':
      return state.filter(({ url }) => url !== action.url);
    default:
      return state;
  }
};
