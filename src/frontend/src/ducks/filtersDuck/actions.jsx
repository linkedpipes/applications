import types from './types';
import StorageToolbox from '@storage/StorageToolbox';

// Map

const setSelectedMapOptions = filters => {
  return {
    type: types.SET_SELECTED_MAP_OPTIONS,
    filters
  };
};

const setSelectedScheme = (filterName, schemes) => {
  return {
    type: types.SET_SELECTED_SCHEME,
    schemes
  };
};

const setSelectedSchemeWithSolid = (filterName, schemes, isEditing) => {
  return (dispatch, getState) => {
    const state = getState();
    const oldSchemes =
      state.filters.filtersState.filterGroups.schemeFilter.options;
    dispatch(setSelectedScheme(filterName, schemes));

    if (isEditing) {
      const metadata = state.application.selectedApplicationMetadata;

      if (metadata) {
        const difference = schemes.filter(x => !oldSchemes.includes(x));
        if (difference.length > 0 && oldSchemes.length > 0) {
          StorageToolbox.setSelectedFilterOptions(
            metadata.solidFileUrl,
            difference
          );
        }
      }
    }
  };
};

const setSelectedNodes = (filterName, nodes) => {
  return {
    type: types.SET_SELECTED_NODES,
    nodes,
    filterName
  };
};

const setSelectedNodesWithSolid = (filterName, nodes, isEditing) => {
  return (dispatch, getState) => {
    const state = getState();
    const oldNodes =
      state.filters.filtersState.filterGroups.nodesFilter.options;
    dispatch(setSelectedNodes(filterName, nodes));

    if (isEditing) {
      const metadata = state.application.selectedApplicationMetadata;

      if (metadata) {
        const difference = nodes.filter(x => !oldNodes.includes(x));
        if (difference.length > 0 && oldNodes.length > 0) {
          StorageToolbox.setSelectedFilterOptions(
            metadata.solidFileUrl,
            difference
          );
        }
      }
    }
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
    if (metadata) {
      StorageToolbox.setFiltersStateEnabled(metadata.solidFileUrl, value);
    }
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
    if (metadata) {
      StorageToolbox.setFiltersStateVisible(metadata.solidFileUrl, value);
    }
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
  setSelectedSchemeWithSolid,
  setSelectedNodes,
  setFiltersState,
  setDefaultFiltersState,
  toggleVisible,
  toggleEnabled,
  toggleEnabledWithSolid,
  resetFilters,
  toggleVisibleWithSolid,
  setSelectedNodesWithSolid,
  setSelectedMapOptions
};
