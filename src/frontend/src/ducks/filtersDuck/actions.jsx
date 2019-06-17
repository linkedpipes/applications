import types from './types';
import StorageToolbox from '@storage/StorageToolbox';

const setSelectedScheme = (filterName, schemes) => {
  return {
    type: types.SET_SELECTED_SCHEME,
    schemes
  };
};

const setSelectedNodes = (filterName, nodes) => {
  return {
    type: types.SET_SELECTED_NODES,
    nodes,
    filterName
  };
};

const setSelectedNodesWithSolid = (filterName, nodes) => {
  return (dispatch, getState) => {
    const state = getState();
    const oldNodes =
      state.filters.filtersState.filterGroups.nodesFilter.selectedOptions.items;
    dispatch(setSelectedNodes(filterName, nodes));
    const difference = oldNodes.filter(x => !nodes.includes(x));
    let filtersOptionsToUpdate = nodes;
    if (difference.length === 0 || oldNodes.length === 0) {
      filtersOptionsToUpdate = difference;
    }

    const metadata = state.application.selectedApplicationMetadata;
    StorageToolbox.setNodesSelectedOptions(
      metadata.solidFileUrl,
      filtersOptionsToUpdate
    );
  };
};

const toggleEnabled = value => {
  return {
    type: types.TOGGLE_ENABLED,
    value
  };
};

const toggleEnabledWithSolid = value => {
  return (dispatch, getState) => {
    dispatch(toggleEnabled(value));
    const state = getState();
    const metadata = state.application.selectedApplicationMetadata;
    StorageToolbox.setFiltersStateEnabled(metadata.solidFileUrl, value);
  };
};

const toggleVisible = value => {
  return {
    type: types.TOGGLE_VISIBLE,
    value
  };
};

const toggleVisibleWithSolid = value => {
  return (dispatch, getState) => {
    dispatch(toggleVisible(value));
    const state = getState();
    const metadata = state.application.selectedApplicationMetadata;
    StorageToolbox.setFiltersStateVisible(metadata.solidFileUrl, value);
  };
};

const setFiltersState = value => {
  return {
    type: types.SET_FILTERS_STATE,
    value
  };
};

const setDefaultFiltersState = visualizerCode => {
  return {
    type: types.SET_DEFAULT_FILTERS_STATE,
    visualizerCode
  };
};

const resetFilters = () => {
  return {
    type: types.RESET_FILTERS
  };
};

export default {
  setSelectedScheme,
  setSelectedNodes,
  setFiltersState,
  setDefaultFiltersState,
  toggleVisible,
  toggleEnabled,
  toggleEnabledWithSolid,
  resetFilters,
  toggleVisibleWithSolid,
  setSelectedNodesWithSolid
};
