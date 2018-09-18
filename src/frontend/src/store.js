import { applyMiddleware, createStore, combineReducers } from "redux";
import datasourcesReducer from "./reducers/datasources";
import pipelines from "./reducers/pipelines";
import executions from "./reducers/executions";
import dialogs from "./reducers/dialogs";
import logger from "redux-logger";

export default () => {
  const store = createStore(
    combineReducers({
      datasources: datasourcesReducer,
      pipelines: pipelines,
      dialogs: dialogs,
      executions: executions
    }),
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(logger)
  );

  return store;
};
