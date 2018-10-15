// Pipelines Reducer

const visualizersReducerDefaultState = [];

export default (state = visualizersReducerDefaultState, action) => {
  switch (action.type) {
    case "ADD_VISUALIZER":
      return action.visualizers.array;
    case "REMOVE_VISUALIZER":
      return state.filter(({ id }) => id !== action.pipelines.id);
    default:
      return state;
  }
};
