// ADD_DISCOVERY
export const addDiscoveryIdAction = ({ id } = {}) => ({
  type: "SET_DISCOVERY_ID",
  discovery: {
    id: id
  }
});

// ADD_SELECTED_VIZUALIZER
export const addSelectedVisualizerAction = ({ data } = {}) => ({
  type: "SET_SELECTED_VISUALIZER",
  selectedVisualizer: data
});

// SET_SELECTED_DATASOURCES_EXAMPLE
export const setSelectedDatasourcesExample = ({ data } = {}) => ({
  type: "SET_SELECTED_DATASOURCES_EXAMPLE",
  datasourcesValues: data
});

// ADD_SELECTED_RESULT_GRAPH_IRI_ACTION
export const addSelectedResultGraphIriAction = ({ data } = {}) => ({
  type: "SET_SELECTED_RESULT_GRAPH_IRI",
  selectedResultGraphIri: data
});

// SET_USER_AUTHENTICATION_STATUS
export const setUserAuthenticationStatus = ({ status } = {}) => ({
  type: "SET_USER_AUTHENTICATION_STATUS",
  authenticationStatus: status
});
