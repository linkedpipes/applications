import types from './types';

const addSelectedVisualizerAction = ({ data } = {}) => {
  return {
    type: types.SET_SELECTED_VISUALIZER,
    selectedVisualizer: data
  };
};

const setChooseFolderDialogState = ({ state }) => {
  return {
    type: types.SET_CHOOSE_FOLDER_DIALOG_STATE,
    isOpen: state
  };
};

export default {
  addSelectedVisualizerAction,
  setChooseFolderDialogState
};
