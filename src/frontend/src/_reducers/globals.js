export default (state = {}, action) => {
  switch (action.type) {
    case "SET_DISCOVERY_ID":
      return { ...state, discoveryId: action.discovery.id };
    default:
      return { ...state };
  }
};
