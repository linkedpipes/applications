// Dialogs Reducer

const dialogsReducerDefaultState = false;

export default (state = dialogsReducerDefaultState, action) => {
  switch (action.type) {
    case "SHOW_ADD_DATASOURCES_DIALOG":
      return action.isVisible;
    case "HIDE_ADD_DATASOURCES_DIALOG":
      return action.isVisible;
    default:
      return state;
  }
};
