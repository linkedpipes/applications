import uuid from "uuid";

// ADD_EXPENSE
export const showDatasourcesDialog = ({} = {}) => ({
  type: "SHOW_ADD_DATASOURCES_DIALOG",
  isVisible: true
});

// REMOVE_SOURCE
export const hideDatasourcesDialog = ({} = {}) => ({
  type: "HIDE_ADD_DATASOURCES_DIALOG",
  isVisible: false
});
