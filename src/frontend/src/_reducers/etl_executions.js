// Executions Reducer

const executionsReducerDefaultState = { executions: {} };

export default (state = executionsReducerDefaultState, action) => {
  switch (action.type) {
    case 'ADD_EXECUTION':
      return {
        ...state,
        executions: {
          ...state.executions,
          [action.pipelineId]: action.executionValues
        }
      };
    case 'REMOVE_EXECUTION':
      return state.filter(({ id }) => id !== action.id);
    default:
      return state;
  }
};
