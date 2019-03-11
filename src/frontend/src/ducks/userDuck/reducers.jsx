import types from './types';

const INITIAL_STATE = {
  webId: '',
  applications: [],
  discoverySessions: [],
  pipelineExecutions: []
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_USER_PROFILE:
      return action.profile;
    default:
      return state;
  }
};

export default userReducer;
