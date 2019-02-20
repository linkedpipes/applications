// Exports Reducer

const exportsReducerDefaultState = { exportRecords: {} };

export default (state = exportsReducerDefaultState, action) => {
  switch (action.type) {
    case 'ADD_EXPORT':
      return {
        ...state,
        exportRecords: {
          ...state.exportRecords,
          [action.pipelineId]: action.exportValues
        }
      };
    case 'REMOVE_EXPORT':
      return state.filter(({ id }) => id !== action.id);
    default:
      return state;
  }
};
