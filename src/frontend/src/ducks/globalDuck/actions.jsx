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

const setAccessControlDialogState = ({ state }) => {
  return {
    type: types.SET_ACCESS_CONTROL_DIALOG_STATE,
    isOpen: state
  };
};

const setInboxDialogState = state => {
  return {
    type: types.SET_INBOX_DIALOG_STATE,
    isOpen: state
  };
};

const setLightColorTheme = isLight => {
  return {
    type: types.SET_LIGHT_COLOR_THEME,
    value: isLight
  };
};

const setSelectedDashboardTabIndex = tabIndex => {
  return {
    type: types.SET_SELECTED_DASHBOARD_TAB_INDEX,
    value: tabIndex
  };
};

const setSelectedDiscverTabIndex = tabIndex => {
  return {
    type: types.SET_SELECTED_DISCOVER_TAB_INDEX,
    value: tabIndex
  };
};

const setSelectedApplicationSetupTabIndex = tabIndex => {
  return {
    type: types.SET_SELECTED_APPLICATION_SETUP_TAB_INDEX,
    value: tabIndex
  };
};

const setSelectedApplicationsBrowserTabIndex = tabIndex => {
  return {
    type: types.SET_SELECTED_APPLICATIONS_BROWSER_TAB_INDEX,
    value: tabIndex
  };
};

const setSelectedSettingsTabIndex = tabIndex => {
  return {
    type: types.SET_SELECTED_SETTINGS_TAB_INDEX,
    value: tabIndex
  };
};

const setMobileDrawerState = drawerState => {
  return {
    type: types.SET_MOBILE_DRAWER_STATE,
    value: drawerState
  };
};

const setSelectedNavigationItem = item => {
  return {
    type: types.SET_SELECTED_NAVIGATION_ITEM,
    value: item
  };
};

export default {
  addSelectedVisualizerAction,
  setAccessControlDialogState,
  setLightColorTheme,
  setChooseFolderDialogState,
  setSelectedDashboardTabIndex,
  setInboxDialogState,
  setMobileDrawerState,
  setSelectedDiscverTabIndex,
  setSelectedApplicationSetupTabIndex,
  setSelectedApplicationsBrowserTabIndex,
  setSelectedSettingsTabIndex,
  setSelectedNavigationItem
};
