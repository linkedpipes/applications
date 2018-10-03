// Pipelines Reducer

const pipelinesReducerDefaultState = [];

export default (state = pipelinesReducerDefaultState, action) => {
  switch (action.type) {
    case "ADD_PIPELINES":
      return action.pipelines.array;
    case "REMOVE_PIPELINES":
      return state.filter(({ id }) => id !== action.pipelines.id);
    default:
      return state;
  }
};
