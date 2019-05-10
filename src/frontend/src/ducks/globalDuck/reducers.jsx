import types from './types';

const INITIAL_STATE = {
  headerParams: {
    title: ''
  },
  selectedVisualizer: { visualizer: { visualizerCode: 'UNDEFINED' } },
  chooseFolderDialogIsOpen: false,
  shareApplicationDialogIsOpen: false,
  inboxDialogIsOpen: false,
  colorThemeIsLight: false
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

    case types.SET_ACCESS_CONTROL_DIALOG_STATE:
      return {
        ...state,
        shareApplicationDialogIsOpen: action.isOpen
      };

    case types.SET_INBOX_DIALOG_STATE:
      return {
        ...state,
        inboxDialogIsOpen: action.isOpen
      };

    case types.SET_LIGHT_COLOR_THEME:
      return {
        ...state,
        colorThemeIsLight: action.value
      };

    default:
      return { ...state };
  }
};

export default globalReducer;
