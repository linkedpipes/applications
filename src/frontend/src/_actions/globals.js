// ADD_DISCOVERY
export const addDiscoveryIdAction = ({ id } = {}) => ({
  type: "SET_DISCOVERY_ID",
  discovery: {
    id: id
  }
});
