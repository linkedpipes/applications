export default (
  state = {
    sparqlEndpointIri: "",
    dataSampleIri: "",
    namedGraph: "",
    selectedTab: 0
  },
  action
) => {
  switch (action.type) {
    case "SET_DISCOVERY_ID":
      return { ...state, discoveryId: action.discovery.id };

    case "TAB_CHANGED":
      return { ...state, selectedTab: action.selectedTab };
    case "SET_SELECTED_DATASOURCES_EXAMPLE":
      switch (action.sample.type) {
        case "Simple":
          const uris = action.sample.URIS;
          let value = uris.join(",\n");
          return {
            ...state,
            datasourcesValues: value,
            sparqlEndpointIri: "",
            dataSampleIri: "",
            namedGraph: ""
          };
        case "Advanced":
          const {
            sparqlEndpointIri,
            dataSampleIri,
            namedGraph
          } = action.sample;
          return {
            ...state,
            datasourcesValues: null,
            selectedResultGraphIri: null,
            sparqlEndpointIri: sparqlEndpointIri,
            dataSampleIri: dataSampleIri,
            namedGraph: namedGraph
          };
        default:
          return { ...state };
      }

    case "SET_SELECTED_VISUALIZER":
      return { ...state, selectedVisualizer: action.selectedVisualizer };

    case "SET_SELECTED_RESULT_GRAPH_IRI":
      return {
        ...state,
        selectedResultGraphIri: action.selectedResultGraphIri
      };
    default:
      return { ...state };
  }
};
