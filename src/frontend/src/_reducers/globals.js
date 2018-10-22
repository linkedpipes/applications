export default (state = {}, action) => {
  switch (action.type) {
    case "SET_DISCOVERY_ID":
      return { ...state, discoveryId: action.discovery.id };
    case "SET_SELECTED_VISUALIZER":
      return { ...state, selectedVisualizer: action.selectedVisualizer };
    default:
      return { ...state };
  }
};
