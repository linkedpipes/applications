import types from './types';

const INITIAL_STATE = {
  headerParams: {
    title: ''
  },
  selectedVisualizer: { visualizer: { visualizerCode: 'UNDEFINED' } },
  chooseFolderDialogIsOpen: false,
  dashboardTabIndex: 0,
  applicationSetupTabIndex: 0,
  discoverTabIndex: 0,
  settingsTabIndex: 0,
  applicationsBrowserTabIndex: 0,
  colorThemeIsLight: false,
  inboxDialogIsOpen: false,
  shareApplicationDialogIsOpen: false,
  drawerState: false
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

    case types.SET_SELECTED_DASHBOARD_TAB_INDEX:
      return {
        ...state,
        dashboardTabIndex: action.value
      };

    case types.SET_SELECTED_DISCOVER_TAB_INDEX:
      return {
        ...state,
        discoverTabIndex: action.value
      };

    case types.SET_SELECTED_APPLICATION_SETUP_TAB_INDEX:
      return {
        ...state,
        applicationSetupTabIndex: action.value
      };

    case types.SET_SELECTED_APPLICATIONS_BROWSER_TAB_INDEX:
      return {
        ...state,
        applicationsBrowserTabIndex: action.value
      };

    case types.SET_SELECTED_SETTINGS_TAB_INDEX:
      return {
        ...state,
        settingsTabIndex: action.value
      };

    case types.SET_MOBILE_DRAWER_STATE:
      return {
        ...state,
        drawerState: action.value
      };

    default:
      return { ...state };
  }
};

export default globalReducer;
