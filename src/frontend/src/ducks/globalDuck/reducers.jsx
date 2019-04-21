import types from './types';

const INITIAL_STATE = {
  headerParams: {
    title: ''
  },
  selectedVisualizer: { visualizer: { visualizerCode: 'UNDEFINED' } },
  chooseFolderDialogIsOpen: false
};

const globalReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_SELECTED_VISUALIZER:
      return Object.assign({}, state, {
        selectedVisualizer: action.selectedVisualizer
      });

    case types.SET_CHOOSE_FOLDER_DIALOG_STATE:
      return {
        ...state,
        chooseFolderDialogIsOpen: action.isOpen
      };

    default:
      return { ...state };
  }
};

export default globalReducer;
