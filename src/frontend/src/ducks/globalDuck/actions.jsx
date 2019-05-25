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

const setLightColorTheme = isLight => {
  return {
    type: types.SET_LIGHT_COLOR_THEME,
    value: isLight
  };
};

const setSelectedHomepageTabIndex = tabIndex => {
  return {
    type: types.SET_SELECTED_HOMEPAGE_TAB_INDEX,
    value: tabIndex
  };
};

export default {
  addSelectedVisualizerAction,
  setLightColorTheme,
  setChooseFolderDialogState,
  setSelectedHomepageTabIndex
};
