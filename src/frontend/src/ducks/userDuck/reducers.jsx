import types from './types';
import update from 'immutability-helper';

const INITIAL_STATE = {
  webId: undefined,
  applicationsFolder: '',
  applications: [],
  discoverySessions: [],
  pipelineExecutions: [],
  name: '',
  image: undefined
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_USER_PROFILE:
      return {
        ...state,
        applications: action.profile.applications,
        discoverySessions: action.profile.discoverySessions,
        pipelineExecutions: action.profile.pipelineExecutions
      };

    case types.SET_SOLID_USER_PROFILE:
      return {
        ...state,
        applications: action.profile.applications,
        discoverySessions: action.profile.discoverySessions,
        pipelineExecutions: action.profile.pipelineExecutions,
        name: action.solidUsername,
        image: action.solidImage
      };

    case types.SET_USER_WEBID:
      return {
        ...state,
        webId: action.value
      };

    case types.SET_USER_SOLID_NAME:
      return {
        ...state,
        name: action.value
      };

    case types.SET_USER_SOLID_IMAGE:
      return {
        ...state,
        image: action.value
      };

    case types.ADD_DISCOVERY_SESSION:
      return {
        ...state,
        discoverySessions: state.discoverySessions.concat(action.session)
      };

    case types.DELETE_DISCOVERY_SESSION:
      return {
        ...state,
        discoverySessions: state.discoverySessions.filter(
          ({ discoveryId }) => discoveryId !== action.discoveryId
        )
      };

    case types.UPDATE_DISCOVERY_SESSION:
      return update(state, {
        discoverySessions: {
          $apply: discoverySessions =>
            discoverySessions.map(item => {
              if (item.discoveryId === action.session.discoveryId) {
                const newItem = item;
                Object.keys(action.session).forEach(key => {
                  if (
                    action.session[key] !== -1 &&
                    action.session[key] !== undefined
                  ) {
                    newItem[key] = action.session[key];
                  }
                });
                return newItem;
              }
              return item;
            })
        }
      });

    case types.ADD_EXECUTION_SESSION:
      return {
        ...state,
        pipelineExecutions: state.pipelineExecutions.concat(action.session)
      };

    case types.DELETE_EXECUTION_SESSION:
      return {
        ...state,
        pipelineExecutions: state.pipelineExecutions.filter(
          ({ executionIri }) => executionIri !== action.executionIri
        )
      };

    case types.UPDATE_EXECUTION_SESSION:
      return update(state, {
        pipelineExecutions: {
          $apply: pipelineExecutions =>
            pipelineExecutions.map(item => {
              if (item.executionIri === action.session.executionIri) {
                const newItem = item;
                Object.keys(action.session).forEach(key => {
                  if (
                    action.session[key] !== -1 &&
                    action.session[key] !== undefined
                  ) {
                    newItem[key] = action.session[key];
                  }
                });
                return newItem;
              }
              return item;
            })
        }
      });

    case types.UPDATE_APPLICATIONS_FOLDER:
      return {
        ...state,
        applicationsFolder: action.value
      };

    default:
      return state;
  }
};

export default userReducer;
